import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OG Grabber - Fetch and download Open Graph images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          padding: "60px",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "72px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            <span>OG</span>
            <span style={{ color: "#22c55e" }}>Grabber</span>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a3a3a3",
              textAlign: "center",
            }}
          >
            Fetch and download Open Graph images at full resolution
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "32px",
              fontSize: "20px",
              color: "#737373",
            }}
          >
            <span>A</span>
            <span style={{ color: "#22c55e", fontSize: "24px" }}>LIMEHAWK</span>
            <span>Product</span>
            <div
              style={{
                width: "12px",
                height: "20px",
                backgroundColor: "#22c55e",
                marginLeft: "4px",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
