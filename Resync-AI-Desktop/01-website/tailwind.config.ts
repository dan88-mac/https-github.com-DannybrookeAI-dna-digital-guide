import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        resync: {
          bg: "#050508",
          surface: "#0c0c12",
          border: "#1a1a28",
          accent: "#22d3ee",
          glow: "#2dd4bf",
          indigo: "#6366f1",
          success: "#34d399",
          warn: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        pan: "pan 3s ease-in-out infinite",
        "transition-lap": "transition-lap 1.2s ease-out forwards",
        "drop-down": "drop-down 2s ease-in-out infinite",
        "fade-rise": "fade-rise 0.8s ease-out forwards",
        "reveal-wipe": "reveal-wipe 1s ease-out forwards",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        "circuit-flow": "circuit-flow 2s linear infinite",
        "parallax-drift": "parallax-drift 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pan: {
          "0%": { transform: "translateX(0)", opacity: "0.4" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(120px)", opacity: "0.4" },
        },
        "transition-lap": {
          "0%": { transform: "translateX(-8%)", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { transform: "translateX(8%)", opacity: "0" },
        },
        "drop-down": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
        "fade-rise": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-wipe": {
          from: { clipPath: "inset(0 100% 0 0)", opacity: "0.6" },
          to: { clipPath: "inset(0 0 0 0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.15)",
            opacity: "0.85",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.35)",
            opacity: "1",
          },
        },
        "circuit-flow": {
          "0%": { strokeDashoffset: "24", opacity: "0.3" },
          "50%": { opacity: "0.8" },
          "100%": { strokeDashoffset: "0", opacity: "0.3" },
        },
        "parallax-drift": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-4px) translateX(2px)" },
          "66%": { transform: "translateY(2px) translateX(-2px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
