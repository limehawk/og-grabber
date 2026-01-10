import { NextRequest, NextResponse } from "next/server";
import {
  validateUrl,
  sanitizeFilename,
  FETCH_TIMEOUT_MS,
  MAX_IMAGE_SIZE,
} from "@/app/lib/url-validator";

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const rawFilename = searchParams.get("filename") || "og-image";

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  // Validate URL to prevent SSRF
  const validation = validateUrl(imageUrl);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Sanitize filename to prevent header injection
  const filename = sanitizeFilename(rawFilename);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGGrabber/1.0)",
        "Accept": "image/*",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: 400 }
      );
    }

    // Check content type is an image
    const contentType = response.headers.get("content-type") || "";
    const isValidImageType = ALLOWED_IMAGE_TYPES.some(type =>
      contentType.toLowerCase().includes(type.split("/")[1])
    );

    if (!isValidImageType && !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "URL does not point to a valid image" },
        { status: 400 }
      );
    }

    // Check content length before reading
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image is too large to download" },
        { status: 400 }
      );
    }

    // Read response with size limit
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "Failed to read image" },
        { status: 500 }
      );
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > MAX_IMAGE_SIZE) {
        reader.cancel();
        return NextResponse.json(
          { error: "Image is too large to download" },
          { status: 400 }
        );
      }
      chunks.push(value);
    }

    const imageBuffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));

    // Determine extension from content type
    const extension = contentType.includes("jpeg") || contentType.includes("jpg")
      ? "jpg"
      : contentType.includes("webp")
        ? "webp"
        : contentType.includes("gif")
          ? "gif"
          : contentType.includes("svg")
            ? "svg"
            : "png";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType || "image/png",
        "Content-Disposition": `attachment; filename="${filename}.${extension}"`,
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(imageBuffer.length),
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out" },
        { status: 408 }
      );
    }

    console.error("Error downloading image:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
