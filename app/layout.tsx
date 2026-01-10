import type { Metadata } from "next";
import { Workbench, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const workbench = Workbench({
  variable: "--font-workbench",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://og-grabber.vercel.app"),
  title: "OG Grabber - Download OG Images",
  description: "Fetch and download Open Graph images from any URL at full resolution. Perfect for social media managers, marketers, and developers.",
  openGraph: {
    title: "OG Grabber",
    description: "Fetch and download Open Graph images from any URL at full resolution",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Grabber",
    description: "Fetch and download Open Graph images from any URL at full resolution",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workbench.variable} ${jetbrainsMono.variable} bg-neutral-950 text-white min-h-screen antialiased`} style={{ fontFamily: "var(--font-jetbrains)" }}>
        {children}
      </body>
    </html>
  );
}
