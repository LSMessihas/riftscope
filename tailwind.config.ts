import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07111f",
        surface: "#0d1a2d",
        surfaceAlt: "#13253e",
        accent: "#5af2c7",
        accentSoft: "#97f9de",
        text: "#f5fbff",
        textMuted: "#8ca8c2",
        border: "rgba(151, 249, 222, 0.16)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(90, 242, 199, 0.18), transparent 45%)",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(90, 242, 199, 0.15)",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
