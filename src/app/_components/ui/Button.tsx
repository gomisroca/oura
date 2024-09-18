import React from 'react'

interface ButtonProps {
  name: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ name, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  return (
    <button 
    name={name} 
    type={type} 
    onClick={onClick} 
    className={`${className} rounded-full bg-neutral-200/30 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/60 px-10 py-3 shadow-md font-semibold transition hover:bg-neutral-200/60 ${disabled ? 'cursor-not-allowed' : ''} flex flex-row gap-2 items-center`} disabled={disabled}>
      {children}
    </button>	
  )
}

export default Button