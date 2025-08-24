import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1E40AF"
        },
        accent: {
          cyan: "#22D3EE",
          green: "#22C55E",
          amber: "#F59E0B",
          red: "#EF4444"
        },
        surface: "#0F172A",
        muted: "#1E293B"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        "2xl": "1.25rem"
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": { "0%": { transform: "translateY(20px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
