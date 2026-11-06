import type { Metadata, Viewport } from "next";
import { bodyFont, headingFont, labelFont } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bench · The Alfie by Heineken",
  description: "Join The Bench for The Alfie's opening night at Melrose Arch.",
};

export const viewport: Viewport = {
  themeColor: "#072a21",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${headingFont.variable} ${labelFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
