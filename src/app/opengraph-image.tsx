import { ImageResponse } from "next/og";

export const alt = "BiteMap — a map and community for anglers";
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
          background: "linear-gradient(135deg, #073748 0%, #0b5368 58%, #317e78 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 48, fontWeight: 800, letterSpacing: "-2px" }}>
          Bite<span style={{ color: "#f7a83b" }}>Map</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#ffb444", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>
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
