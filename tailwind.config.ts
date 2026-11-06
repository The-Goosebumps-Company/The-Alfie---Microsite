import type { Config } from "tailwindcss";

// Colours from Grid's Alfie brand deck (colour palette page).
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F6F4EE", // page ground: a warm white that sits with the deck's white pages
        ink: "#031c1f", // Alfie palette, darkest
        forest: "#003a2a", // Alfie palette
        emerald: "#005a42", // Alfie palette
        mint: "#9fd08b", // Alfie palette, light
        glow: "#006e37", // where the signature gradient meets Heineken green
        slate: "#3b4a46", // body text on ivory
        star: "#e50000", // Heineken red: the star only
        alert: "#FFB4AB", // error text on the green panel
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
