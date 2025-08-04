/**
 * Input field component that displays an input field with a specified name, type, placeholder, and handleValueChange function.
 * 
 * @param name - The name of the input field.
 * @param type - The type of the input field (e.g., "text", "email", "number").
 * @param placeholder - The placeholder text to display when the input field is empty.
 * @param required - Whether the input field is required.
 * @param min - The minimum value for the input field.
 * @param max - The maximum value for the input field.
 * @param step - The step size for the input field.
 * @param handleValueChange - A function that is called when the input field's value changes.
 *
 * @example 
 * <InputField name="Email" type="email" placeholder="Enter email" handleValueChange={handleValueChange} />
 */

import React from 'react'

interface InputFieldProps {
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  handleValueChange: (value: string) => void
}

function InputField({ name, type, placeholder, required = false, min, max, step, handleValueChange }: InputFieldProps) {
  const [value, setValue] = React.useState('')
  React.useEffect(() => {
    handleValueChange(value)
  }, [value])

  return (
    <input 
    name={name} 
    type={type} 
    required={required}
    placeholder={placeholder} 
    value={value} 
    onChange={(e) => setValue(e.target.value)} 
    className="w-full rounded-sm px-4 py-2 bg-slate-300 dark:bg-slate-700"
    min={min}
    max={max}
    step={step}
    />
  )
}

export default InputField