/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Adjust paths to match your file structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};