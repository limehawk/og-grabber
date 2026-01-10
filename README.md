<div align="center">

# OG Grabber

### Fetch and download Open Graph images at full resolution

[![Live Demo](https://img.shields.io/badge/demo-og--grabber.vercel.app-black?style=for-the-badge)](https://og-grabber.vercel.app/)

[![Deploy with Vercel](https://img.shields.io/badge/vercel-deploy-black?style=flat-square&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/limehawk/og-grabber)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue?style=flat-square&logo=docker)](https://ghcr.io/limehawk/og-grabber)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

<br />

[**Try the Live Demo →**](https://og-grabber.vercel.app/)

<br />

</div>

---

A fast, simple tool to fetch and download Open Graph images from any URL. Perfect for social media managers, marketers, and developers who need to preview or repurpose OG images.

<br />

## Features

| | |
|---|---|
| **Full Resolution** | Get OG images at their original size (typically 1200×630) |
| **Instant Preview** | See exactly how your links will appear on social media |
| **One-Click Download** | Save images with clean, SEO-friendly filenames |
| **Entity Decoding** | Properly handles `&amp;`, `&quot;`, and other encoded characters |
| **No API Keys** | Works out of the box with any public URL |
| **Self-Hostable** | Deploy on Vercel, Docker, or any Node.js environment |

<br />

## Use Cases

**Social Media Management** — Preview and download OG images for posts, newsletters, or presentations

**SEO & Marketing** — Audit OG images across your site or competitors' sites

**Content Repurposing** — Grab images for link roundups, curated content, or social shares

**Development & QA** — Test and debug Open Graph implementations

**Design Review** — Check branding consistency and text legibility across pages

<br />

## Quick Start

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/limehawk/og-grabber)

### Run Locally

```bash
git clone https://github.com/limehawk/og-grabber.git
cd og-grabber
npm install
npm run dev
```

<br />

## Docker

**Pull and run:**

```bash
docker pull ghcr.io/limehawk/og-grabber:latest
docker run -d -p 3000:3000 ghcr.io/limehawk/og-grabber:latest
```

**Or with Docker Compose:**

```yaml
services:
  og-grabber:
    image: ghcr.io/limehawk/og-grabber:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
```

```bash
docker compose up -d
```

**Build from source:**

```bash
docker build -t og-grabber .
docker run -d -p 3000:3000 og-grabber
```

<br />

## API

### `GET /api/fetch-og?url=<URL>`

Returns OG metadata:

```json
{
  "imageUrl": "https://example.com/og-image.png",
  "title": "Page Title",
  "description": "Page description",
  "sourceUrl": "https://example.com/page"
}
```

### `GET /api/download?url=<IMAGE_URL>&filename=<NAME>`

Proxies and downloads the image.

<br />

## Tech Stack

[Next.js 15](https://nextjs.org/) • [Tailwind CSS 4](https://tailwindcss.com/) • [TypeScript](https://www.typescriptlang.org/)

<br />

## License

MIT

---

<div align="center">

Built by **[Limehawk](https://limehawk.io)** — Enterprise IT Security & Managed Services

</div>
