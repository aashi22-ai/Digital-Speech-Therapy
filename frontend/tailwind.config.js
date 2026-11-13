/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        duo: {
          yellow: "#ffc800",
          "yellow-dark": "#e5a500",
          "yellow-light": "#fff5cc",
          "yellow-badge": "#fff8d6",
          green: "#ffc800",
          "green-dark": "#e5a500",
          "green-light": "#fff5cc",
          blue: "#1cb0f6",
          "blue-dark": "#1899d6",
          "blue-light": "#ddf4ff",
          orange: "#ff9600",
          "orange-dark": "#e68700",
          "orange-light": "#ffebd1",
          red: "#ff4b4b",
          "red-dark": "#ea2b2b",
          "red-light": "#ffdfe0",
          purple: "#ce82ff",
          "purple-dark": "#a855f7",
          "purple-light": "#f3e8ff",
          gray: "#e5e5e5",
          "gray-dark": "#afafaf",
          dark: "#4b4b4b",
          neutral: "#777777",
          card: "#ffffff",
        },
      },
      fontFamily: {
        duo: ["Nunito", "DIN Next Rounded LT Pro", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        bounceShort: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 200, 0, 0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(255, 200, 0, 0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "bounce-short": "bounceShort 1.5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
