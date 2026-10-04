import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { delimiter, join } from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2];
if (mode !== "rules" && mode !== "e2e") {
  throw new Error("Expected test mode: rules or e2e.");
}

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const candidates = [process.env.JAVA_HOME, null];
if (process.platform === "darwin") {
  candidates.push(
    "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
    "/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
  );
}

let javaEnv;
for (const javaHome of candidates) {
  if (javaHome && !existsSync(javaHome)) continue;
  const env = javaHome
    ? { ...process.env, JAVA_HOME: javaHome, PATH: `${join(javaHome, "bin")}${delimiter}${process.env.PATH ?? ""}` }
    : { ...process.env };
  const result = spawnSync("java", ["-version"], { env, encoding: "utf8" });
  const version = `${result.stdout ?? ""}${result.stderr ?? ""}`.match(/version "(\d+)/);
  if (result.status === 0 && Number(version?.[1]) >= 21) {
    javaEnv = env;
    break;
  }
}

if (!javaEnv) {
  console.error("Tests require Java 21+. Install a JDK and set JAVA_HOME. Homebrew openjdk@21 is detected automatically on macOS.");
  process.exit(1);
}

const child = spawn(process.execPath, [
  require.resolve("firebase-tools/lib/bin/firebase.js"),
  "emulators:exec", "--only", mode === "e2e" ? "auth,firestore" : "firestore",
  "--project", "demo-bitemap",
  mode === "e2e" ? "playwright test" : "node --test tests/firestore-rules.test.mjs",
], { cwd: root, env: javaEnv, stdio: "inherit" });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => { process.exitCode = code ?? 1; });
