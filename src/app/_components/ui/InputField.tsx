/**
 * Input field component that displays an input field with a specified name, type, placeholder, and handleValueChange function.
 * 
 * @param {{ name: string; type?: string; placeholder?: string; handleValueChange: (value: string) => void; }} props - The props for the InputField component.
 *
 * @example 
 * <InputField name="Email" type="email" placeholder="Enter email" handleValueChange={handleValueChange} />
 */

import React from 'react'

interface InputFieldProps {
  name: string
  type?: string
  placeholder?: string
  handleValueChange: (value: string) => void
}

function InputField({ name, type, placeholder, handleValueChange }: InputFieldProps) {
  const [value, setValue] = React.useState('')
  React.useEffect(() => {
    handleValueChange(value)
  }, [value])

  return (
    <input 
    name={name} 
    type={type} 
    placeholder={placeholder} 
    value={value} 
    onChange={(e) => setValue(e.target.value)} 
    className="w-full rounded-full px-4 py-2 bg-slate-300 dark:bg-slate-700" />
  )
}

export default InputField