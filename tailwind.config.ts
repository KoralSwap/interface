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
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
      },
      padding: {
        xs: "4px",
        xxs: "8px",
        sm: "12px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // Neutral scale
        neutral: {
          0: "hsl(var(--neutral-0), <alpha-value>)",
          50: "hsl(var(--neutral-50), <alpha-value>)",
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

        // Blue scale
        blue: {
          50: "hsl(var(--blue-50), <alpha-value>)",
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

        // Primary (Purple/Indigo)
        primary: {
          50: "hsl(var(--primary-50), <alpha-value>)",
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
          DEFAULT: "hsl(var(--primary-500))",
          foreground: "hsl(var(--foreground))",
        },

        // Cyan/Teal
        cyan: {
          400: "hsl(var(--cyan-400), <alpha-value>)",
          500: "hsl(var(--cyan-500), <alpha-value>)",
          600: "hsl(var(--cyan-600), <alpha-value>)",
          700: "hsl(var(--cyan-700), <alpha-value>)",
          800: "hsl(var(--cyan-800), <alpha-value>)",
          900: "hsl(var(--cyan-900), <alpha-value>)",
        },

        // Error states
        error: {
          400: "hsl(var(--error-400), <alpha-value>)",
          500: "hsl(var(--error-500), <alpha-value>)",
          600: "hsl(var(--error-600), <alpha-value>)",
          900: "hsl(var(--error-900), <alpha-value>)",
          950: "hsl(var(--error-950), <alpha-value>)",
        },

        // Success states
        success: {
          400: "hsl(var(--success-400), <alpha-value>)",
          500: "hsl(var(--success-500), <alpha-value>)",
          600: "hsl(var(--success-600), <alpha-value>)",
          900: "hsl(var(--success-900), <alpha-value>)",
          950: "hsl(var(--success-950), <alpha-value>)",
        },

        // Warning states
        warning: {
          400: "hsl(var(--warning-400), <alpha-value>)",
          500: "hsl(var(--warning-500), <alpha-value>)",
          600: "hsl(var(--warning-600), <alpha-value>)",
        },

        // Background layers
        "bg-primary": "hsl(var(--bg-primary), <alpha-value>)",
        "bg-secondary": "hsl(var(--bg-secondary), <alpha-value>)",
        "bg-tertiary": "hsl(var(--bg-tertiary), <alpha-value>)",
        "bg-elevated": "hsl(var(--bg-elevated), <alpha-value>)",
        "bg-hover": "hsl(var(--bg-hover), <alpha-value>)",
        "bg-active": "hsl(var(--bg-active), <alpha-value>)",

        // Shadcn defaults
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary":
          "linear-gradient(135deg, hsl(220, 95%, 65%) 0%, hsl(260, 85%, 65%) 100%)",
        "gradient-accent":
          "linear-gradient(135deg, hsl(185, 95%, 60%) 0%, hsl(220, 95%, 65%) 100%)",
        "gradient-mesh":
          "radial-gradient(at 0% 0%, hsl(220, 95%, 65%) 0px, transparent 50%), radial-gradient(at 100% 0%, hsl(260, 85%, 65%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(185, 95%, 60%) 0px, transparent 50%), radial-gradient(at 0% 100%, hsl(220, 95%, 65%) 0px, transparent 50%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(99, 102, 241, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
