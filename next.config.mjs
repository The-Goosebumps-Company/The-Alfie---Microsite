// STATIC_DEMO=1 builds the GitHub Pages demo: plain files, no server. Run it through
// `npm run build:demo` (scripts/build-demo.mjs), which first removes the server-only routes.
const staticDemo = process.env.STATIC_DEMO === "1";
const basePath = process.env.PAGES_BASE_PATH ?? ""; // e.g. "/The-Alfie---Microsite" on GitHub Pages

/** @type {import('next').NextConfig} */
const nextConfig = staticDemo
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_STATIC_DEMO: "1", NEXT_PUBLIC_BASE_PATH: basePath },
      devIndicators: false,
    }
  : {
      poweredByHeader: false,
      devIndicators: false, // keeps the Next badge off the design previews
      // The QR points at /bench. Query strings (?src=, ?box=) are carried through.
      async redirects() {
        return [
          { source: "/", destination: "/bench", permanent: false },
          { source: "/register", destination: "/bench", permanent: false },
        ];
      },
    };

export default nextConfig;
