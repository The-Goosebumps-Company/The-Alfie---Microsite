import type { Metadata, Viewport } from "next";
import { bodyFont, headingFont, scriptFont } from "@/fonts";
import { isPreviewMode } from "@/lib/previewMode";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bench · The Alfie by Heineken",
  description: "Join The Bench for The Alfie's opening night at Melrose Arch.",
  // Keep the team preview out of search results.
  ...(isPreviewMode ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#F6F4EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${scriptFont.variable} ${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        {children}
        {isPreviewMode && (
          <div className="pointer-events-none fixed right-3 top-3 z-50 rounded-full bg-ink/85 px-3 py-1.5 font-body text-[10px] font-medium uppercase tracking-[0.18em] text-mint">
            Preview · sign-ups aren’t saved
          </div>
        )}
      </body>
    </html>
  );
}
