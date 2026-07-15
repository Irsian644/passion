import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F5",
        ivory: "#F5F1EC",
        linen: "#EFE9E1",
        ink: "#1C1A17",
        charcoal: "#222222",
        stone: "#6B6259",
        mist: "#A89F94",
        gold: {
          DEFAULT: "#B08D57",
          soft: "#C6A87C",
          light: "#E4D2B4",
          deep: "#8A6D3F",
        },
        rose: {
          DEFAULT: "#D8A0A0",
          soft: "#E8C4C0",
          blush: "#F3E3DF",
        },
        wine: "#7A2230",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wide2: "0.14em",
      },
      maxWidth: {
        content: "1360px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
        "luxe-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      boxShadow: {
        // Layered, low-opacity shadows — barely-there, never a heavy drop
        soft: "0 1px 1px rgba(28,26,23,0.03), 0 12px 28px -18px rgba(28,26,23,0.18)",
        lift: "0 2px 4px rgba(28,26,23,0.04), 0 30px 60px -30px rgba(28,26,23,0.26)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
