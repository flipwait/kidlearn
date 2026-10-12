import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional theme
        pro: {
          bg: "#f8fafc",
          card: "#ffffff",
          primary: "#0f766e",
          secondary: "#334155",
          accent: "#0d9488",
          muted: "#64748b",
          border: "#e2e8f0",
        },
        // Kid mode theme
        kid: {
          bg: "#f0f9ff",
          card: "#ffffff",
          primary: "#3b82f6",
          secondary: "#ec4899",
          accent: "#f59e0b",
          purple: "#a855f7",
          green: "#22c55e",
          yellow: "#eab308",
          pink: "#f472b6",
          muted: "#64748b",
          border: "#bfdbfe",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        kid: "0 8px 30px -4px rgba(59, 130, 246, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
