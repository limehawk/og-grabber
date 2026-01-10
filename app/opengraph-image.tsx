import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OG Grabber - Fetch and download Open Graph images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const workbench = await fetch(
    "https://fonts.gstatic.com/s/workbench/v3/FeV8S05Gp6Et7FcfbPFK1rynGd_MxtkvNFmoUDFhgF2VKTGQk6vapdOL.ttf"
  ).then((res) => res.arrayBuffer());

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
        {/* Subtle gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "96px",
                fontFamily: "Workbench",
                color: "#22c55e",
                textShadow: "0 0 60px rgba(34, 197, 94, 0.5)",
              }}
            >
              OG GRABBER
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              margin: 0,
            }}
          >
            Fetch and download Open Graph images at full resolution
          </p>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
              fontSize: "18px",
              color: "#525252",
            }}
          >
            <span>A</span>
            <span style={{ color: "#22c55e", fontFamily: "Workbench" }}>LIMEHAWK</span>
            <span>Product</span>
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
      ],
    }
  );
}
