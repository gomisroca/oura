'use client';

/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa6';

import Button from './ui/Button';

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button name="theme-button" onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}>
      <FaSun className="size-[1.2rem] rotate-0 scale-100 text-neutral-800 transition-all dark:-rotate-90 dark:scale-0" />
      <FaMoon className="absolute size-[1.2rem] rotate-90 scale-0 text-neutral-200 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme</span>
    </Button>
  );
}
export default ThemeButton;
