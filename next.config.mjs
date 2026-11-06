/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // The ticket route reads its fonts from disk; make sure they ship with it.
  outputFileTracingIncludes: { "/api/ticket/[id]": ["./src/fonts/ticket/**"] },
  // The QR points at /bench. Query strings (?src=, ?box=) are carried through.
  async redirects() {
    return [
      { source: "/", destination: "/bench", permanent: false },
      { source: "/register", destination: "/bench", permanent: false },
    ];
  },
};

export default nextConfig;
