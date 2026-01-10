import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OG Grabber - Fetch and download Open Graph images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [workbench, jetbrainsMono] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/workbench/v3/FeV8S05Gp6Et7FcfbPFK1rynGd_MxtkvNFmoUDFhgF2VKTGQk6vapdOL.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.ttf"
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
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* Main title - matching site style */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "20px",
            }}
          >
            <span
              style={{
                fontSize: "160px",
                fontFamily: "JetBrains Mono",
                fontWeight: 800,
                color: "#22c55e",
              }}
            >
              OG
            </span>
            <span
              style={{
                fontSize: "160px",
                fontFamily: "JetBrains Mono",
                fontWeight: 100,
                color: "#ffffff",
              }}
            >
              Grabber
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "32px",
              fontFamily: "JetBrains Mono",
              fontWeight: 200,
              color: "#737373",
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
              gap: "16px",
              marginTop: "48px",
              fontSize: "16px",
              fontFamily: "JetBrains Mono",
              color: "#525252",
              fontWeight: 100,
            }}
          >
            <span style={{ letterSpacing: "6px", textTransform: "uppercase" }}>A</span>
            <span style={{ color: "#22c55e", fontFamily: "Workbench", fontSize: "28px" }}>LIMEHAWK</span>
            <span style={{ letterSpacing: "6px", textTransform: "uppercase" }}>Product</span>
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
          name: "JetBrains Mono",
          data: jetbrainsMono,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
