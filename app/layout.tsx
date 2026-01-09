import type { Metadata } from "next";
import { Workbench, Space_Mono } from "next/font/google";
import "./globals.css";

const workbench = Workbench({
  variable: "--font-workbench",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "OG Grabber - Download OG Images",
  description: "Fetch and download Open Graph images from any URL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${workbench.variable} ${spaceMono.variable} bg-neutral-950 text-white min-h-screen antialiased`} style={{ fontFamily: "var(--font-space-mono)" }}>
        {children}
      </body>
    </html>
  );
}
