import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore";

const projectId = "demo-bitemap";
const testUser = { uid: "angler-1" };
const otherUser = { uid: "angler-2" };
const adminUser = { uid: "moderator-1" };
let environment;

const publishedSpot = {
  ownerId: testUser.uid,
  visibility: "published",
  name: { uk: "Тестова водойма", en: "Test lake" },
};

const publicReport = {
  authorId: testUser.uid,
  targetId: "lake-1",
  targetType: "user-spot",
  isPublic: true,
  tripDate: "2026-10-01",
  fish: ["carp"],
  waterTemperatureC: 18,
};

before(async () => {
  environment = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
    },
  });
});

beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "user-spots/lake-1"), publishedSpot);
    await setDoc(doc(db, "user-spots/private-lake"), {
      ...publishedSpot,
      visibility: "private",
    });
    await setDoc(doc(db, "admins", adminUser.uid), {});
    await setDoc(doc(db, "fishing-reports/report-1"), publicReport);
    await setDoc(doc(db, "fishing-reports/private-report"), {
      ...publicReport,
      isPublic: false,
    });
    await setDoc(doc(db, "articles/published-article"), {
      slug: "published-article",
      authorId: adminUser.uid,
      status: "published",
    });
    await setDoc(doc(db, "articles/draft-article"), {
      slug: "draft-article",
      authorId: adminUser.uid,
      status: "draft",
    });
  });
});

after(async () => {
  await environment?.cleanup();
});

test("public content is readable while private spots, reports, and drafts stay private", async () => {
  const guestDb = environment.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(guestDb, "user-spots/lake-1")));
  await assertFails(getDoc(doc(guestDb, "user-spots/private-lake")));
  await assertSucceeds(getDoc(doc(guestDb, "fishing-reports/report-1")));
  await assertFails(getDoc(doc(guestDb, "fishing-reports/private-report")));
  await assertSucceeds(getDoc(doc(guestDb, "articles/published-article")));
  await assertFails(getDoc(doc(guestDb, "articles/draft-article")));
});

test("a user can create a spot only for their own UID", async () => {
  const db = environment.authenticatedContext(testUser.uid).firestore();
  await assertSucceeds(setDoc(doc(db, "user-spots/new-lake"), {
    ...publishedSpot,
    visibility: "private",
  }));
  await assertFails(setDoc(doc(db, "user-spots/spoofed-lake"), {
    ...publishedSpot,
    ownerId: otherUser.uid,
  }));
});

test("reports require authentication and cannot spoof author or target", async () => {
  const guestDb = environment.unauthenticatedContext().firestore();
  const userDb = environment.authenticatedContext(testUser.uid).firestore();
  await assertFails(setDoc(doc(guestDb, "fishing-reports/guest-report"), publicReport));
  await assertSucceeds(setDoc(doc(userDb, "fishing-reports/new-report"), publicReport));
  await assertFails(setDoc(doc(userDb, "fishing-reports/spoofed-report"), {
    ...publicReport,
    authorId: otherUser.uid,
  }));
  await assertFails(updateDoc(doc(userDb, "fishing-reports/report-1"), {
    authorId: otherUser.uid,
  }));
  await assertFails(updateDoc(doc(userDb, "fishing-reports/report-1"), {
    waterTemperatureC: 41,
  }));
});

test("water temperature is optional but bounded on report creation and edits", async () => {
  const db = environment.authenticatedContext(testUser.uid).firestore();
  const reportWithoutTemperature = { ...publicReport };
  delete reportWithoutTemperature.waterTemperatureC;
  await assertSucceeds(setDoc(doc(db, "fishing-reports/no-temperature"), reportWithoutTemperature));
  await assertFails(setDoc(doc(db, "fishing-reports/invalid-temperature"), {
    ...publicReport,
    waterTemperatureC: -3,
  }));
  await assertSucceeds(updateDoc(doc(db, "fishing-reports/report-1"), {
    waterTemperatureC: 40,
  }));
});

test("only an admin can hide a report, and moderation cannot edit its content", async () => {
  const userDb = environment.authenticatedContext(otherUser.uid).firestore();
  const adminDb = environment.authenticatedContext(adminUser.uid).firestore();
  await assertFails(updateDoc(doc(userDb, "fishing-reports/report-1"), {
    isPublic: false,
    moderationStatus: "hidden",
  }));
  await assertSucceeds(updateDoc(doc(adminDb, "fishing-reports/report-1"), {
    isPublic: false,
    moderationStatus: "hidden",
  }));
  await assertFails(updateDoc(doc(adminDb, "fishing-reports/private-report"), {
    isPublic: false,
    moderationStatus: "hidden",
    authorId: adminUser.uid,
  }));
});

test("content reports are authenticated, target-bound, deduplicated, and admin-moderated", async () => {
  const guestDb = environment.unauthenticatedContext().firestore();
  const userDb = environment.authenticatedContext(otherUser.uid).firestore();
  const adminDb = environment.authenticatedContext(adminUser.uid).firestore();
  const reportId = `${otherUser.uid}__fishing-report__user-spot____lake-1__report-1`;
  const complaint = {
    targetType: "fishing-report",
    targetId: "report-1",
    parentId: "lake-1",
    contextType: "user-spot",
    contextId: "",
    reporterId: otherUser.uid,
    reason: "inaccurate",
    details: "Перевірити, будь ласка",
    status: "open",
    createdAt: new Date(),
  };

  await assertFails(setDoc(doc(guestDb, "content-reports/guest-complaint"), complaint));
  await assertSucceeds(setDoc(doc(userDb, `content-reports/${reportId}`), complaint));
  await assertFails(setDoc(doc(userDb, `content-reports/${reportId}`), complaint));
  await assertFails(getDocs(collection(userDb, "content-reports")));
  await assertSucceeds(getDocs(collection(adminDb, "content-reports")));
  await assertSucceeds(updateDoc(doc(adminDb, `content-reports/${reportId}`), {
    status: "dismissed",
    reviewedBy: adminUser.uid,
    reviewedAt: new Date(),
  }));
  await assertFails(updateDoc(doc(userDb, `content-reports/${reportId}`), {
    status: "actioned",
    reviewedBy: otherUser.uid,
    reviewedAt: new Date(),
  }));
});

test("only admins can create, edit, and remove articles", async () => {
  const userDb = environment.authenticatedContext(testUser.uid).firestore();
  const adminDb = environment.authenticatedContext(adminUser.uid).firestore();
  const article = { slug: "new-article", authorId: adminUser.uid, status: "draft" };
  await assertFails(setDoc(doc(userDb, "articles/user-article"), article));
  await assertSucceeds(setDoc(doc(adminDb, "articles/new-article"), article));
  await assertSucceeds(updateDoc(doc(adminDb, "articles/new-article"), { status: "published" }));
  await assertFails(updateDoc(doc(userDb, "articles/new-article"), { status: "draft" }));
});
