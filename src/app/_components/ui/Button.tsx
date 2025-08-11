/**
 * Button component that displays a button with a specified name and optional className.
 *
 * @param {{ name: string; type?: "button" | "submit" | "reset"; onClick?: () => void; className?: string; children: React.ReactNode; disabled?: boolean; }} props - The props for the Button component.
 *
 * @example
 * <Button name="Submit" onClick={handleSubmit}>
 *   Submit
 * </Button>
 */

import React from 'react'
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  name?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ name, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  return (
    <button 
    aria-label={name || 'button'}
    name={name || 'Button'}
    type={type} 
    onClick={onClick} 
    className={twMerge('justify-center cursor-pointer whitespace-nowrap text-nowrap duration-100 ease-in rounded-sm hover:scale-110 bg-neutral-100 active:scale-90 dark:bg-neutral-800 backdrop-blur-sm  dark:shadow-neutral-500/10 dark:hover:bg-neutral-900 px-10 py-3 shadow-md font-semibold transition hover:bg-neutral-200 active:duration-100 active:bg-neutral-300 dark:active:bg-neutral-950 flex flex-row gap-2 items-center', className, disabled && 'cursor-not-allowed')} disabled={disabled}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'

export default Button