'use client';

/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa6';

import Button from '../ui/Button';

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button name={theme === 'dark' ? 'Light' : 'Dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <FaMoon
        name="light"
        size={20}
        className="rotate-0 scale-100 text-slate-800 transition-all dark:-rotate-90 dark:scale-0"
      />
      <FaSun
        name="dark"
        size={20}
        className="absolute rotate-90 scale-0 text-slate-200 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
}
export default ThemeButton;
