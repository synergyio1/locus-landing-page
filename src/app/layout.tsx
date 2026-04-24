import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { SiteNav } from "@/components/site-nav";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { ScrollProgressPath } from "@/components/ui/scroll-progress-path";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getlocus.tech"),
  title: "Locus — finish the things you keep starting",
  description:
    "An AI planner that shapes your day, an on-device monitor that keeps it honest, and a Friday review that tells you what actually moved. For macOS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <NoiseOverlay />
        <ScrollProgressPath />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
