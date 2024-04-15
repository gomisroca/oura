/** @type {import('tailwindcss').Config} */
const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 
'red', 'orange', 'amber', 'yellow', 
'lime', 'green', 'emerald', 
'teal', 'cyan', 'sky', 'blue',
'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
// Generate regular expression patterns for colors ending with 400
const colorPatterns = colors.map(c => `bg-${c}-400`).join('|');
const safelistPatterns = [
  { pattern: new RegExp(`(${colorPatterns})`) },
  { pattern: /bg-(black|white)/ }
];
module.exports = {
  safelist: safelistPatterns,
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}