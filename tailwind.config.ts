import { type Config } from 'tailwindcss';

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ['class'],
  content: ['./src/**/*.tsx'],
  plugins: [],
} satisfies Config;
