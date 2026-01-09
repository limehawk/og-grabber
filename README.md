# OG Grabber

A fast, simple tool to fetch and download Open Graph images from any URL at full resolution. Perfect for social media managers, marketers, and developers who need to preview or repurpose OG images.

## Features

- **Full Resolution Downloads** - Get OG images at their original size (typically 1200×630)
- **Instant Preview** - See exactly how your links will appear on social media
- **One-Click Download** - Save images directly with clean, SEO-friendly filenames
- **HTML Entity Decoding** - Properly handles `&amp;`, `&quot;`, and other encoded characters
- **No API Keys Required** - Works out of the box with any public URL
- **Self-Hostable** - Deploy on Vercel, Docker, or any Node.js environment

## Use Cases

### Social Media Management
Preview and download OG images to use in social media posts, newsletters, or presentations without taking screenshots.

### SEO & Marketing
Audit OG images across your site or competitors' sites. Ensure your meta tags are generating the right preview images.

### Content Repurposing
Grab OG images from blog posts or articles to use in link roundups, curated content, or social shares.

### Development & QA
Test and debug Open Graph implementations. Verify that dynamically generated OG images render correctly.

### Design Review
Download OG images to review branding consistency, text legibility, and visual quality across different pages.

## Quick Start

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/limehawk/og-grabber)

### Local Development

```bash
git clone https://github.com/limehawk/og-grabber.git
cd og-grabber
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker Deployment

### Pull from GitHub Container Registry

```bash
docker pull ghcr.io/limehawk/og-grabber:latest
```

### Run the Container

```bash
docker run -d -p 3000:3000 ghcr.io/limehawk/og-grabber:latest
```

Access at [http://localhost:3000](http://localhost:3000)

### Docker Compose

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

### Build Your Own Image

```bash
git clone https://github.com/limehawk/og-grabber.git
cd og-grabber
docker build -t og-grabber .
docker run -d -p 3000:3000 og-grabber
```

## API Endpoints

### GET `/api/fetch-og?url=<URL>`

Fetches OG metadata from the specified URL.

**Response:**
```json
{
  "imageUrl": "https://example.com/og-image.png",
  "title": "Page Title",
  "description": "Page description",
  "sourceUrl": "https://example.com/page"
}
```

### GET `/api/download?url=<IMAGE_URL>&filename=<NAME>`

Proxies and downloads the image with the specified filename.

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT
