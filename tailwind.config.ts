import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jetbrainsMono: ["var(--font-jetbrains-mono)"],
      },
      margin: {},
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
      },
      padding: { xs: "4px", xxs: "8px", sm: "12px" },
      colors: {
        background: "#0A0A0D",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        yellow: "hsl(var(--yellow), <alpha-value>)",
        ["blue-light"]: "hsl(var(--blue-light), <alpha-value>)",
        ["pink"]: "hsl(var(--pink), <alpha-value>)",
        neutral: {
          100: "hsl(var(--neutral-100), <alpha-value>)",
          200: "hsl(var(--neutral-200), <alpha-value>)",
          300: "hsl(var(--neutral-300), <alpha-value>)",
          400: "hsl(var(--neutral-400), <alpha-value>)",
          500: "hsl(var(--neutral-500), <alpha-value>)",
          600: "hsl(var(--neutral-600), <alpha-value>)",
          700: "hsl(var(--neutral-700), <alpha-value>)",
          800: "hsl(var(--neutral-800), <alpha-value>)",
          900: "hsl(var(--neutral-900), <alpha-value>)",
          950: "hsl(var(--neutral-950), <alpha-value>)",
          1000: "hsl(var(--neutral-1000), <alpha-value>)",
          1050: "hsl(var(--neutral-1050), <alpha-value>)",
        },

        blue: {
          100: "hsl(var(--blue-100), <alpha-value>)",
          200: "hsl(var(--blue-200), <alpha-value>)",
          300: "hsl(var(--blue-300), <alpha-value>)",
          400: "hsl(var(--blue-400), <alpha-value>)",
          500: "hsl(var(--blue-500), <alpha-value>)",
          600: "hsl(var(--blue-600), <alpha-value>)",
          700: "hsl(var(--blue-700), <alpha-value>)",
          800: "hsl(var(--blue-800), <alpha-value>)",
          900: "hsl(var(--blue-900), <alpha-value>)",
          950: "hsl(var(--blue-950), <alpha-value>)",
        },

        primary: {
          100: "hsl(var(--primary-100), <alpha-value>)",
          200: "hsl(var(--primary-200), <alpha-value>)",
          300: "hsl(var(--primary-300), <alpha-value>)",
          400: "hsl(var(--primary-400), <alpha-value>)",
          500: "hsl(var(--primary-500), <alpha-value>)",
          600: "hsl(var(--primary-600), <alpha-value>)",
          700: "hsl(var(--primary-700), <alpha-value>)",
          800: "hsl(var(--primary-800), <alpha-value>)",
          900: "hsl(var(--primary-900), <alpha-value>)",
          950: "hsl(var(--primary-950), <alpha-value>)",
        },
        error: {
          100: "hsl(var(--error-100), <alpha-value>)",
          200: "hsl(var(--error-200), <alpha-value>)",
          300: "hsl(var(--error-300), <alpha-value>)",
          400: "hsl(var(--error-400), <alpha-value>)",
          500: "hsl(var(--error-500), <alpha-value>)",
          600: "hsl(var(--error-600), <alpha-value>)",
          700: "hsl(var(--error-700), <alpha-value>)",
          800: "hsl(var(--error-800), <alpha-value>)",
          900: "hsl(var(--error-900), <alpha-value>)",
          950: "hsl(var(--error-950), <alpha-value>)",
        },
        success: {
          100: "hsl(var(--success-100), <alpha-value>)",
          200: "hsl(var(--success-200), <alpha-value>)",
          300: "hsl(var(--success-300), <alpha-value>)",
          400: "hsl(var(--success-400), <alpha-value>)",
          500: "hsl(var(--success-500), <alpha-value>)",
          600: "hsl(var(--success-600), <alpha-value>)",
          700: "hsl(var(--success-700), <alpha-value>)",
          800: "hsl(var(--success-800), <alpha-value>)",
          900: "hsl(var(--success-900), <alpha-value>)",
          950: "hsl(var(--success-950), <alpha-value>)",
        },

        ["bg-def"]: "hsl(var(--bg-def), <alpha-value>)",
        ["bg-subtle"]: "hsl(var(--bg-subtle), <alpha-value>)",
        ["bg-sub-hover"]: "hsl(var(--bg-sub-hover), <alpha-value>)",
        ["bg-sub-pressed"]: "hsl(var(--bg-sub-prssed), <alpha-value>)",
        ["bg-base"]: "hsl(var(--bg-base), <alpha-value>)",
        ["bg-base-pressed"]: "hsl(var(--bg-base-pressed), <alpha-value>)",
        ["bg-overlay"]: "hsl(var(--bg-overlay), <alpha-value>)",
        ["bg-other"]: "hsl(var(--bg-other), <alpha-value>)",
        ["bg-other-2"]: "hsl(var(--bg-other-2), <alpha-value>)",
        ["bg-other-3"]: "hsl(var(--bg-other-3), <alpha-value>)",
        ["bg-other-4"]: "hsl(var(--bg-other-4), <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
