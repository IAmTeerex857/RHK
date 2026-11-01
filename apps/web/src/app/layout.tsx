import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { QuickActions } from "@/components/site/quick-actions";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rushhourkidstransportation.com"),
  title: {
    default: "Rush Hour Kids Transportation | Safe school rides in metro Atlanta",
    template: "%s | Rush Hour Kids Transportation",
  },
  description:
    "Before and after school pick-up and drop-off across Decatur, Stone Mountain, Douglas, Fulton and Gwinnett County. Every child checked on and off, with live tracking for parents.",
  openGraph: {
    type: "website",
    siteName: "Rush Hour Kids Transportation",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffc629",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${geist.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="-mt-[84px] md:-mt-[88px]">
          {children}
        </main>
        <Footer />
        <QuickActions />
      </body>
    </html>
  );
}
