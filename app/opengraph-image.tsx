import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OG Grabber - Fetch and download Open Graph images";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const spaceMono = await fetch(
    "https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRUEY.ttf"
  ).then((res) => res.arrayBuffer());

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
          backgroundColor: "#000000",
          padding: "60px",
          fontFamily: "Space Mono",
          position: "relative",
        }}
      >
        {/* Scanline overlay effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        {/* Grid pattern background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(51, 255, 51, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 255, 51, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Terminal window frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            border: "2px solid #33FF33",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(51, 255, 51, 0.2)",
          }}
        >
          {/* Terminal header bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              backgroundColor: "rgba(51, 255, 51, 0.1)",
              borderBottom: "1px solid #33FF33",
              gap: "12px",
            }}
          >
            {/* Terminal dots */}
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#33FF33",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#33FF33",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#33FF33",
                  opacity: 0.2,
                }}
              />
            </div>
            <span
              style={{
                color: "#33FF33",
                fontSize: "16px",
                opacity: 0.7,
              }}
            >
              og-grabber@limehawk:~/tools
            </span>
          </div>

          {/* Terminal content */}
          <div
            style={{
              display: "flex",
              flex: 1,
              padding: "50px",
              alignItems: "center",
              justifyContent: "center",
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
              {/* Command prompt line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#00CC00",
                    fontSize: "20px",
                  }}
                >
                  {"$ "}
                </span>
                <span
                  style={{
                    color: "#33FF33",
                    fontSize: "20px",
                    opacity: 0.8,
                  }}
                >
                  fetch --og-image https://example.com
                </span>
              </div>

              {/* Main title with glow effect */}
              <h1
                style={{
                  color: "#33FF33",
                  fontSize: "72px",
                  fontFamily: "Workbench",
                  fontWeight: 400,
                  margin: 0,
                  textShadow:
                    "0 0 10px rgba(51, 255, 51, 0.8), 0 0 20px rgba(51, 255, 51, 0.4), 0 0 40px rgba(51, 255, 51, 0.2)",
                  letterSpacing: "-1px",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                OG GRABBER
                <span
                  style={{
                    width: "16px",
                    height: "52px",
                    backgroundColor: "#33FF33",
                    marginLeft: "8px",
                  }}
                />
              </h1>

              {/* Description */}
              <p
                style={{
                  color: "#33FF33",
                  fontSize: "24px",
                  margin: 0,
                  opacity: 0.8,
                  textAlign: "center",
                }}
              >
                Fetch and download Open Graph images at full resolution
              </p>

              {/* Blinking cursor line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <span
                  style={{
                    color: "#00CC00",
                    fontSize: "20px",
                  }}
                >
                  {"$ "}
                </span>
                <span
                  style={{
                    color: "#33FF33",
                    fontSize: "20px",
                    width: "12px",
                    height: "24px",
                    backgroundColor: "#33FF33",
                    marginLeft: "4px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            paddingTop: "16px",
          }}
        >
          <span
            style={{
              color: "#33FF33",
              fontSize: "18px",
              opacity: 0.6,
            }}
          >
            og-grabber.vercel.app
          </span>
          <span
            style={{
              color: "#33FF33",
              fontSize: "16px",
              opacity: 0.4,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            A LIMEHAWK Product
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Space Mono",
          data: spaceMono,
          weight: 400,
          style: "normal",
        },
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
