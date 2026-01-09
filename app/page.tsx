"use client";

import { useState } from "react";

interface OGData {
  imageUrl: string;
  title: string;
  description: string;
  sourceUrl: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchOgImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setOgData(null);
    setImageLoaded(false);

    try {
      // Ensure URL has protocol
      let fetchUrl = url.trim();
      if (!fetchUrl.startsWith("http")) {
        fetchUrl = "https://" + fetchUrl;
      }

      const response = await fetch(
        `/api/fetch-og?url=${encodeURIComponent(fetchUrl)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch OG data");
      }

      setOgData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!ogData) return;

    // Create filename from title
    const filename = ogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "og-image";

    // Use download proxy to avoid CORS
    window.location.href = `/api/download?url=${encodeURIComponent(ogData.imageUrl)}&filename=${encodeURIComponent(filename)}`;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">OG Grabber</h1>
        <p className="text-neutral-400 mb-8">
          Enter a URL to fetch its Open Graph image at full resolution
        </p>

        <form onSubmit={fetchOgImage} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-600 text-white placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Fetching..." : "Fetch"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-950 border border-red-900 rounded-lg text-red-300 mb-8">
            {error}
          </div>
        )}

        {ogData && (
          <div className="space-y-6">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <h2 className="font-medium mb-1">{ogData.title}</h2>
              {ogData.description && (
                <p className="text-sm text-neutral-400 mb-3">
                  {ogData.description}
                </p>
              )}
              <p className="text-xs text-neutral-500 break-all">
                {ogData.sourceUrl}
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg overflow-hidden relative">
              {!imageLoaded && (
                <div className="w-full aspect-[1200/630] bg-neutral-900 animate-pulse flex items-center justify-center">
                  <svg className="w-12 h-12 text-neutral-700 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogData.imageUrl}
                alt={ogData.title}
                className={`w-full h-auto ${imageLoaded ? "block" : "hidden"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Download Image
              </button>
              <a
                href={ogData.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Open in New Tab
              </a>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-500 mb-2">Image URL:</p>
              <code className="text-sm text-neutral-300 break-all block">
                {ogData.imageUrl}
              </code>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
