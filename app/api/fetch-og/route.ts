import { NextRequest, NextResponse } from "next/server";

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGGrabber/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

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

    // Resolve relative URLs
    const absoluteImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : new URL(imageUrl, url).toString();

    const title = ogTitleMatch?.[1] || titleMatch?.[1] || "Untitled";
    const description = ogDescMatch?.[1] || "";

    return NextResponse.json({
      imageUrl: absoluteImageUrl,
      title: decodeHtmlEntities(title),
      description: decodeHtmlEntities(description),
      sourceUrl: url,
    });
  } catch (error) {
    console.error("Error fetching OG data:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}
