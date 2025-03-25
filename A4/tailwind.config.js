/** @type {import('tailwindcss').Config} */
module.exports = {
  //content: [`./views/**/*.html`],
  content: [`./views/**/*.ejs`],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['cupcake'],
  },
}

