import { type Config } from 'tailwindcss';
const COLORS = [
  'white',
  'black',
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

const colorPatterns = COLORS.map((c) => `bg-${c}-500`).join('|');
const safelistPatterns = [{ pattern: new RegExp(`(${colorPatterns})`) }, { pattern: /bg-(black|white)/ }];
export default {
  safelist: safelistPatterns,
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ['class'],
  content: ['./src/**/*.tsx'],
  plugins: [],
} satisfies Config;
