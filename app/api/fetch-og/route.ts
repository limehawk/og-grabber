import { NextRequest, NextResponse } from "next/server";
import {
  validateUrl,
  decodeHtmlEntities,
  FETCH_TIMEOUT_MS,
  MAX_HTML_SIZE,
} from "@/app/lib/url-validator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL to prevent SSRF
  const validation = validateUrl(url);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGGrabber/1.0)",
        "Accept": "text/html",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    // Check content length before reading
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_HTML_SIZE) {
      return NextResponse.json(
        { error: "Page is too large to process" },
        { status: 400 }
      );
    }

    // Read response with size limit
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json(
        { error: "Failed to read response" },
        { status: 500 }
      );
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > MAX_HTML_SIZE) {
        reader.cancel();
        return NextResponse.json(
          { error: "Page is too large to process" },
          { status: 400 }
        );
      }
      chunks.push(value);
    }

    const html = new TextDecoder().decode(
      Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))
    );

    // Extract og:image using regex
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
    );

    // Also try twitter:image as fallback
    const twitterImageMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i
    );

    // Extract og:title
    const ogTitleMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i
    );

    // Extract og:description
    const ogDescMatch = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i
    );

    // Extract page title as fallback
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const imageUrl = ogImageMatch?.[1] || twitterImageMatch?.[1];

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No OG image found on this page" },
        { status: 404 }
      );
    }

    // Decode HTML entities in the image URL first
    const decodedImageUrl = decodeHtmlEntities(imageUrl);

    // Resolve relative URLs
    const absoluteImageUrl = decodedImageUrl.startsWith("http")
      ? decodedImageUrl
      : new URL(decodedImageUrl, url).toString();

    // Validate the resolved image URL to prevent SSRF via redirect
    const imageValidation = validateUrl(absoluteImageUrl);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    const title = ogTitleMatch?.[1] || titleMatch?.[1] || "Untitled";
    const description = ogDescMatch?.[1] || "";

    return NextResponse.json({
      imageUrl: absoluteImageUrl,
      title: decodeHtmlEntities(title),
      description: decodeHtmlEntities(description),
      sourceUrl: url,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out" },
        { status: 408 }
      );
    }

    console.error("Error fetching OG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
