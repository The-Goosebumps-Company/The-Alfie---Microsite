// The GitHub Pages demo build (npm run build:demo) has no server: the age check, sign-up and
// ticket all run in the browser and nothing is saved. Set by next.config.mjs at build time.
export const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

/** Prefixes files in /public with the GitHub Pages sub-path (next/image doesn't do it for us). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
