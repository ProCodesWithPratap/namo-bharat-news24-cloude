/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C8102E",
          50:  "#FFF0F2",
          100: "#FFD6DC",
          200: "#FFB3BC",
          300: "#FF8090",
          400: "#FF4D60",
          500: "#C8102E",
          600: "#A50D26",
          700: "#820A1E",
          800: "#5F0716",
          900: "#3C040E",
        },
        accent: "#FF6B00",
        dark: "#111111",
        card: "#F7F7F7",
        border: "#E5E5E5",
        muted: "#6B7280",
        breaking: "#C8102E",
      },
      fontFamily: {
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Source Serif 4'", "Georgia", "serif"],
        ui: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        fadeIn: "fadeIn 0.4s ease-out",
        slideDown: "slideDown 0.3s ease-out",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#1a1a1a",
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "1.125rem",
            lineHeight: "1.8",
            "h1, h2, h3": {
              fontFamily: "'Playfair Display', Georgia, serif",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
