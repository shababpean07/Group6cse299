import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#0D7377',
          dark: '#0a5c60',
          light: '#e6f4f5',
          glow: 'rgba(13,115,119,0.12)',
        },
        sidebar: {
          bg: '#101828',
          border: '#1d2b3a',
        },
        surface: '#ffffff',
        canvas: '#f5f6fa',
        text: {
          primary: '#0f1828',
          secondary: '#8896b0',
          muted: '#aab4c8',
        },
        border: "#e8ecf2",
        input: "#e8ecf2",
        ring: "#0D7377",
        background: "#f5f6fa",
        foreground: "#0f1828",
        primary: {
          DEFAULT: "#0D7377",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e6f4f5",
          foreground: "#0D7377",
        },
        muted: {
          DEFAULT: "#f5f6fa",
          foreground: "#8896b0",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f1828",
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;