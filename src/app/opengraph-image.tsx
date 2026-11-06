import { ImageResponse } from "next/og";

export const alt = "Rybomapa — a map and community for anglers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#fffaf1",
          background: "linear-gradient(135deg, #06202a 0%, #0c4a52 60%, #1b7f79 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 48, fontWeight: 800, letterSpacing: "-2px" }}>
          Rybomapa<span style={{ color: "#ff6b3d" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#5ee0c8", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
            FISHING CLOSER TO NATURE
          </div>
          <div style={{ fontSize: 66, fontWeight: 800, letterSpacing: "-3px" }}>
            Find your next fishing spot.
          </div>
          <div style={{ color: "#d0e0e1", fontSize: 28 }}>
            Explore waters, plan trips and share experience.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", color: "#d0e0e1", fontSize: 22 }}>
          bitemap.artemlira.com
        </div>
      </div>
    ),
    size,
  );
}
