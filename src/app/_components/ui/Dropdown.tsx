'use client';

/**
 * Dropdown component that displays a menu when clicked.
 *
 * @param {{ text: string; className?: string; name?: string }} button - The display in the dropdown button.
 *
 * @param {string} [className] - Optional class names for the dropdown menu.
 * @param {React.ReactNode} children - The content of the dropdown menu.
 * @param {boolean} [closeOnChildClick] - Whether to close the dropdown when a child item is clicked.
 *
 * @example
 * <Dropdown name="Select an option" className="w-56" btnClassName="bg-white">
 *   <li>Option 1</li>
 *   <li>Option 2</li>
 *   <li>Option 3</li>
 * </Dropdown>
 */

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

interface DropdownProps {
  button: {
    text: string | React.ReactNode;
    className?: string;
    name?: string;
  };
  className?: string;
  children: React.ReactNode;
  closeOnChildClick?: boolean;
}

function Dropdown({ button, children, className, closeOnChildClick = true }: DropdownProps) {
  // State variable to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Closes the dropdown when a child item is clicked
  const handleChildClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Renders the button with the provided name and onClick event handler */}
      <Button
        name={button.name ?? 'Dropdown'}
        className={button?.className}
        onClick={() => setIsOpen(!isOpen)}>
        {button.text}
      </Button>
      {/* Renders the dropdown menu if isOpen is true */}
      {isOpen && (
        <div
          className={twMerge('absolute z-50 mt-2', className)}>
          <ul
            onClick={closeOnChildClick ? handleChildClick : undefined}
            className="flex flex-col items-center justify-center gap-2 rounded-md p-2 text-center font-bold text-neutral-800 transition-all duration-200 ease-in-out dark:text-neutral-200">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
