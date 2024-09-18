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
    className="w-full rounded-full px-4 py-2 text-neutral-800" />
  )
}

export default InputField