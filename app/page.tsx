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

    const filename = ogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "og-image";

    window.location.href = `/api/download?url=${encodeURIComponent(ogData.imageUrl)}&filename=${encodeURIComponent(filename)}`;
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header with dramatic weight contrast */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
            <span className="font-extrabold text-green-500">OG</span>
            <span className="font-thin text-white ml-3">Grabber</span>
          </h1>
          <p className="text-neutral-500 font-extralight text-lg tracking-wide">
            Fetch and download Open Graph images at full resolution
          </p>
        </header>

        {/* Search form */}
        <form onSubmit={fetchOgImage} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-5 py-4 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-green-500/50 text-white placeholder:text-neutral-600 font-light text-lg"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full sm:w-auto px-8 py-4 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors text-lg"
            >
              {loading ? "..." : "Fetch"}
            </button>
          </div>
        </form>

        {/* Error state */}
        {error && (
          <div className="p-5 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 mb-8 font-light">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!ogData && !loading && !error && (
          <div className="text-center text-neutral-600 py-20 font-extralight text-lg">
            Enter a URL above to fetch its OG image
          </div>
        )}

        {/* Results */}
        {ogData && (
          <div className="space-y-8">
            {/* Metadata card */}
            <div className="p-6 bg-neutral-900/30 border border-neutral-800/50 rounded-xl">
              <h2 className="font-semibold text-xl mb-2 text-white">{ogData.title}</h2>
              {ogData.description && (
                <p className="text-neutral-400 mb-4 font-extralight leading-relaxed">
                  {ogData.description}
                </p>
              )}
              <p className="text-neutral-600 text-sm break-all font-thin">
                {ogData.sourceUrl}
              </p>
            </div>

            {/* Image preview */}
            <div className="border border-neutral-800/50 rounded-xl overflow-hidden">
              {!imageLoaded && !imageError && (
                <div className="w-full aspect-[1200/630] bg-neutral-900/50 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                </div>
              )}
              {imageError && (
                <div className="w-full aspect-[1200/630] bg-neutral-900/50 flex items-center justify-center">
                  <p className="text-red-400/70 font-extralight text-center px-8">{IMAGE_LOAD_ERROR}</p>
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

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadImage}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 cursor-pointer transition-colors"
              >
                Download
              </button>
              <a
                href={ogData.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-8 py-4 bg-neutral-800/50 text-white font-light rounded-lg hover:bg-neutral-700/50 cursor-pointer transition-colors border border-neutral-700/50"
              >
                Open Original
              </a>
            </div>

            {/* URL display */}
            <div className="p-5 bg-neutral-900/30 border border-neutral-800/50 rounded-xl">
              <p className="text-neutral-600 text-xs mb-3 font-medium uppercase tracking-widest">Direct URL</p>
              <code className="text-neutral-400 break-all block font-thin text-sm">
                {ogData.imageUrl}
              </code>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-neutral-800/50">
          <div className="flex flex-col items-center gap-4">
            <a
              href="https://limehawk.io"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-neutral-600 hover:text-white transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.3em] font-thin">A</span>
              <span
                className="text-2xl text-green-500 group-hover:text-green-400 transition-colors"
                style={{ fontFamily: "var(--font-workbench)" }}
              >
                LIMEHAWK
              </span>
              <span className="text-xs uppercase tracking-[0.3em] font-thin">Product</span>
            </a>
            <p className="text-neutral-700 text-xs font-thin tracking-wider">
              Enterprise IT Security & Managed Services
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
