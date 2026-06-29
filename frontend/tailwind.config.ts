import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg-primary)",
        foreground: "var(--color-text-primary)",
        surface: "var(--color-bg-surface)",
        secondary: "var(--color-bg-secondary)",
        primary: "var(--color-accent)",
        "primary-hover": "var(--color-accent-hover)",
        "primary-alt": "var(--color-accent-alt)",
        border: "var(--color-border)",
        muted: "var(--color-text-muted)",
      },
      animation: {
        'gradient-bg': 'gradientBG 15s ease infinite',
        'gradient-slide': 'gradientSlide 4s linear infinite',
      },
      keyframes: {
        gradientBG: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientSlide: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
