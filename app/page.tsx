"use client";

import { useState } from "react";

interface OGData {
  imageUrl: string;
  title: string;
  description: string;
  sourceUrl: string;
}

const IMAGE_LOAD_ERROR = "Failed to load image. The image may be blocked by CORS or no longer available.";

export default function Home() {
  const [url, setUrl] = useState("https://og-grabber.vercel.app");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchOgImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setOgData(null);
    setImageLoaded(false);
    setImageError(false);

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
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">OG Grabber</h1>
        <p className="text-neutral-400 mb-8 font-light">
          Enter a URL to fetch its Open Graph image at full resolution
        </p>

        <form onSubmit={fetchOgImage} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
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
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Fetching..." : "Fetch"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-950 border border-red-900 rounded-lg text-red-300 mb-8 font-medium">
            {error}
          </div>
        )}

        {!ogData && !loading && !error && (
          <div className="text-center text-neutral-500 py-16 font-light">
            Enter a URL above to fetch its OG image
          </div>
        )}

        {ogData && (
          <div className="space-y-6">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <h2 className="font-bold mb-1">{ogData.title}</h2>
              {ogData.description && (
                <p className="text-sm text-neutral-400 mb-3 font-light">
                  {ogData.description}
                </p>
              )}
              <p className="text-xs text-neutral-500 break-all font-extralight">
                {ogData.sourceUrl}
              </p>
            </div>

            <div className="border border-neutral-800 rounded-lg overflow-hidden relative">
              {!imageLoaded && !imageError && (
                <div className="w-full aspect-[1200/630] bg-neutral-900 animate-pulse flex items-center justify-center">
                  <svg className="w-12 h-12 text-neutral-700 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
              {imageError && (
                <div className="w-full aspect-[1200/630] bg-neutral-900 flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-400 text-sm">{IMAGE_LOAD_ERROR}</p>
                  </div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ogData.imageUrl}
                alt={ogData.title}
                className={`w-full h-auto ${imageLoaded && !imageError ? "block" : "hidden"}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadImage}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Download Image
              </button>
              <a
                href={ogData.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Open in New Tab
              </a>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <p className="text-xs text-neutral-500 mb-2 font-medium uppercase tracking-wider">Image URL</p>
              <code className="text-sm text-neutral-300 break-all block font-light">
                {ogData.imageUrl}
              </code>
            </div>
          </div>
        )}
        <footer className="mt-20 py-8 border-t border-neutral-800">
          <div className="flex flex-col items-center gap-3">
            <a
              href="https://limehawk.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
            >
              <span className="text-sm uppercase tracking-widest font-thin">A</span>
              <span
                className="text-2xl text-green-500 group-hover:text-green-400 transition-colors"
                style={{ fontFamily: "var(--font-workbench)" }}
              >
                LIMEHAWK
              </span>
              <span className="text-sm uppercase tracking-widest font-thin">Product</span>
            </a>
            <p className="text-neutral-600 text-xs font-extralight tracking-wide">
              Enterprise IT Security & Managed Services
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
