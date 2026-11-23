import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Rush Hour Kids Driver", template: "%s · Rush Hour Kids Driver" },
  description: "Your route, stops and children for today.",
  applicationName: "Rush Hour Kids Driver",
  appleWebApp: { capable: true, title: "RHK Driver", statusBarStyle: "default" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f3f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Phones: no zoom when a field gets focus and no drifting page; this is an app, not a document.
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
