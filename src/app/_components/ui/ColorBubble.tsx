import React from 'react'

function ColorBubble({ color, stock }: { color: string, stock?: number }) {
  return (
    <span 
    className={`h-4 w-4 rounded-full border border-slate-800 shadow-md transition duration-200 ease-in-out dark:border-slate-200 
      ${color === 'black' ? 'bg-black' : color === 'white' ? 'bg-white' : `bg-${color}-500`} 
      ${stock === 0 ? 'cursor-auto opacity-30' : stock ? 'cursor-pointer opacity-100 hover:brightness-[1.25]' : ''}`}>
    </span>
  )
}

export default ColorBubble