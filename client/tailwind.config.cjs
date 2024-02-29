/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    {
      pattern: /bg-(red|orange|yellow|blue|purple|green)-(600)/, // You can display all the colors that you need
    },
    {
      pattern: /bg-(black|white)/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}