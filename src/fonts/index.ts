// Font families in one place. These are Google stand-ins for Grid's Romie Serif (headings)
// and Europa Sans (body), self-hosted from ./web. To swap: drop Grid's files into ./web
// (and TTF/OTF copies into ./ticket for the ticket PNG) and point the paths below at them.
import localFont from "next/font/local";

export const headingFont = localFont({
  src: [{ path: "./web/cormorant-500.woff2", weight: "500" }],
  variable: "--font-heading",
  display: "swap",
});

export const labelFont = localFont({
  src: [
    { path: "./web/oswald-500.woff2", weight: "500" },
    { path: "./web/oswald-600.woff2", weight: "600" },
  ],
  variable: "--font-label",
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
