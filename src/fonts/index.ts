// Font families in one place. Google stand-ins for Grid's typefaces, self-hosted from ./web:
// Pinyon Script → Ed Lavonia Script, Cormorant Garamond → Romie Serif, Jost → Europa Sans.
// To swap: drop Grid's files into ./web (and TTF/OTF copies into ./ticket for the ticket PNG)
// and point the paths below at them.
import localFont from "next/font/local";

export const scriptFont = localFont({
  src: [{ path: "./web/pinyon-400.woff2", weight: "400" }],
  variable: "--font-script",
  display: "swap",
});

export const headingFont = localFont({
  src: [{ path: "./web/cormorant-500.woff2", weight: "500" }],
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = localFont({
  src: [
    { path: "./web/jost-400.woff2", weight: "400" },
    { path: "./web/jost-500.woff2", weight: "500" },
  ],
  variable: "--font-body",
  display: "swap",
});
