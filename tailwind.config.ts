import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-alt": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        glass: "var(--surface-glass)",
        ink: "var(--text)",
        muted: "var(--text-muted)",
        line: "var(--border)",
        "line-strong": "var(--border-strong)",
        brand: {
          DEFAULT: "var(--brand)",
          light: "var(--brand-light)",
          dark: "var(--brand-dark)",
          accent: "var(--brand-accent)",
          gold: "var(--brand-gold)",
          crimson: "var(--brand-crimson)",
          emerald: "var(--brand-emerald)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Cambria", '"Times New Roman"', "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop-in": "pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 35s linear infinite",
        "marquee-fast": "marquee 22s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
