import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#D4A017",
        secondary: "#1A3A5C",
        tertiary: "#3B82F6",
        neutral: {
          900: "#0D1117", // App background
          800: "#161B22", // Surface
          700: "#1E2532", // Surface lighter
          border: "#30363D"
        },
        success: "#10B981",
        warning: "#D4A017",
        error: "#EF4444",
        info: "#3B82F6",
      },
    },
  },
  plugins: [],
};
export default config;
