import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#072a21",
        pitch: { a: "#0a3328", b: "#0c3a2d" },
        gold: "#C9A45C",
        cream: "#F0E8D4",
        muted: "#C8C8BE",
        star: "#D7262E",
        alert: "#F4A6A0", // error text: passes AA on deep green, unlike the star red
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        label: ["var(--font-label)", "Arial Narrow", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
