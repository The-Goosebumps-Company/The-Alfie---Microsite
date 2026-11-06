import type { Metadata, Viewport } from "next";
import { bodyFont, headingFont, scriptFont } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bench · The Alfie by Heineken",
  description: "Join The Bench for The Alfie's opening night at Melrose Arch.",
};

export const viewport: Viewport = {
  themeColor: "#F6F4EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${scriptFont.variable} ${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
