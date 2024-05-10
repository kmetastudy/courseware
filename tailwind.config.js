/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/js/**/*.js",

    "./_class/**/*.{html,js}",
    "./_cm/**/*.{html,js}",
    "./_user/**/*.{html,js}",
    "./_main/**/*.{html,js}",
    "./_st/**/*.{html,js}",
    "./_school/**/*.{html,js}",
    "./_st/**/*.{html,js}",
    // "./staticfiles/**/*.{html,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    // themes: ["light", "dark", "cupcake", "winter"],
    themes: [
      "light",
      "dark",
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          "--rounded-btn": "0.5rem",
        },
      },
      "winter",
    ],
  },
};
