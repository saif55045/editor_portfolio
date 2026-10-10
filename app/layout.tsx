import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Cursor from "@/components/ui/Cursor";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  title: "Saif Ullah — Short-form Video Editor",
  description: "Saif Ullah edits scroll-stopping Reels, TikToks and YouTube Shorts. Hook-first storytelling, tight pacing, captions and sound design.",
  openGraph: {
    title: "Saif Ullah — Short-form Video Editor",
    description: "I cut scroll-stopping stories.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#050507", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <Providers>
          <div className="grain" aria-hidden />
          <Cursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
