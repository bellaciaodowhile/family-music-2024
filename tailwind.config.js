const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'notes': "url('./public/images/notes.webp')",
        'home': "url('./public/images/home.webp')",
      }
    },
    
  },
  darkMode: "class",
  plugins: [nextui()]
}