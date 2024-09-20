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
    className={`${className} border dark:border-slate-400/10 duration-200 ease-in-out border-slate-600/10 rounded-full bg-slate-200/30 dark:bg-slate-800/30 dark:shadow-slate-500/10 dark:hover:bg-slate-700/30 px-10 py-3 shadow-md font-semibold transition hover:bg-slate-300/30 ${disabled ? 'cursor-not-allowed' : ''} flex flex-row gap-2 items-center`} disabled={disabled}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'

export default Button