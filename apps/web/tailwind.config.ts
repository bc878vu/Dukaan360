import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dukaan360 brand: emerald primary, deep navy secondary (PRD Part 6)
        primary: {
          DEFAULT: "#059669",
          dark: "#047857",
          light: "#d1fae5",
        },
        navy: {
          DEFAULT: "#0f2a43",
          dark: "#0a1f33",
          light: "#1e3a5f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
