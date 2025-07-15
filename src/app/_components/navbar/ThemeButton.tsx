'use client';

/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';

import Button from '../ui/Button';

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button name={theme === 'dark' ? 'Light' : 'Dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <FaMoon
        name="light"
        size={20}
        className="scale-100 rotate-0 text-slate-800 transition-all dark:scale-0 dark:-rotate-90"
      />
      <FaSun
        name="dark"
        size={20}
        className="absolute scale-0 rotate-90 text-slate-200 transition-all dark:scale-100 dark:rotate-0"
      />
      <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
}
export default ThemeButton;
