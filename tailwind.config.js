/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/js/**/*.js",

    "./_class/**/*.{html,js}",
    "./_cm/**/*.{html,js}",
    "./_user/**/*.{html,js}",
    "./_main/**/*.{html,js}",
    // "./staticfiles/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "winter"],
  },
};
