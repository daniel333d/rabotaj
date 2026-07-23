import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B0F19",
        brand: "#00E88A",
        "brand-light": "rgba(0, 232, 138, 0.12)",
        success: "#00E88A",
        surface: "#0B0F19",
        "surface-raised": "#172033",
        ink: "#F8FAFC",
        muted: "#A7B0C0",
        border: "rgba(167, 176, 192, 0.18)",
        cyan: "#00B4DB",
        purple: "#7B2CFF",
        "purple-deep": "#2A0D4F"
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.24)",
        card: "0 2px 8px rgba(0, 0, 0, 0.32), 0 1px 2px rgba(0, 0, 0, 0.24)",
        elevated: "0 12px 32px rgba(0, 0, 0, 0.45)"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(-8px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "toast-in": "toast-in 0.25s ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
