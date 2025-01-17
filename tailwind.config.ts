/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0d0d0d",
        star: "#f5d742",
        glow: "#ffffff",
      },
    },
  },
  plugins: [],
};
