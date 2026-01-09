import type { Metadata } from "next";
import { Workbench } from "next/font/google";
import "./globals.css";

const workbench = Workbench({
  variable: "--font-workbench",
  subsets: ["latin"],
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
      <body className={`${workbench.variable} bg-neutral-950 text-white min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
