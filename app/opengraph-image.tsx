import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OG Grabber - Fetch and download Open Graph images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Fetch fonts in parallel
  const [workbench, vt323, shareTechMono] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/workbench/v3/FeV8S05Gp6Et7FcfbPFK1rynGd_MxtkvNFmoUDFhgF2VKTGQk6vapdOL.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2hsY.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/sharetechmono/v16/J7aHnp1uDWRBEqV98dVQztYldFc7pA.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* CRT scanline effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Green glow gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Terminal prompt style */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
              fontFamily: "VT323",
              color: "#22c55e",
            }}
          >
            <span style={{ color: "#4ade80" }}>$</span>
            <span style={{ color: "#6b7280" }}>fetch</span>
            <span style={{ color: "#a3a3a3" }}>--og-image</span>
          </div>

          {/* Main title */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "108px",
                fontFamily: "Share Tech Mono",
                color: "#22c55e",
                textShadow: "0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)",
                letterSpacing: "-2px",
              }}
            >
              OG
            </span>
            <span
              style={{
                fontSize: "108px",
                fontFamily: "Workbench",
                color: "#ffffff",
                textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
              }}
            >
              GRABBER
            </span>
          </div>

          {/* Description in VT323 terminal style */}
          <p
            style={{
              fontSize: "36px",
              fontFamily: "VT323",
              color: "#a3a3a3",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            Fetch and download Open Graph images at full resolution
          </p>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "32px",
              fontSize: "20px",
              fontFamily: "Share Tech Mono",
              color: "#525252",
            }}
          >
            <span style={{ letterSpacing: "3px" }}>A</span>
            <span style={{ color: "#22c55e", fontFamily: "Workbench", fontSize: "24px" }}>LIMEHAWK</span>
            <span style={{ letterSpacing: "3px" }}>PRODUCT</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Workbench",
          data: workbench,
          weight: 400,
          style: "normal",
        },
        {
          name: "VT323",
          data: vt323,
          weight: 400,
          style: "normal",
        },
        {
          name: "Share Tech Mono",
          data: shareTechMono,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
