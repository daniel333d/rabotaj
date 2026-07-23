import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1220",
        brand: "#2563EB",
        "brand-light": "#EAF2FF",
        success: "#16A36A",
        surface: "#F7F9FC",
        ink: "#182033",
        muted: "#667085",
        border: "#E4E8F0"
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
        soft: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        card: "0 2px 8px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
        elevated: "0 12px 32px rgba(16, 24, 40, 0.10)"
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
