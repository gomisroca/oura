import React from 'react'

function Message({ children, error = true }: { children: React.ReactNode, error?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 px-5 py-2 font-semibold border rounded-lg ${error ? 'border-red-500 bg-red-200/20 dark:bg-red-800/20' : 'bg-green-500 bg-green-200/20 dark:bg-green-800/20'}`}>
      <p>An error occurred</p>
      <h1 className='text-xl'>{children}</h1>
      <p>Please try again</p>
    </div>
  )
}

export default Message