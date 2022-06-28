const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Poppins', defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
};
