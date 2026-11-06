/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false, // keeps the Next badge off the design previews
  // The ticket route reads its fonts and wordmark from disk; make sure they ship with it.
  outputFileTracingIncludes: { "/api/ticket/[id]": ["./src/fonts/ticket/**", "./src/ticket/alfie-wordmark.png"] },
  // The QR points at /bench. Query strings (?src=, ?box=) are carried through.
  async redirects() {
    return [
      { source: "/", destination: "/bench", permanent: false },
      { source: "/register", destination: "/bench", permanent: false },
    ];
  },
};

export default nextConfig;
