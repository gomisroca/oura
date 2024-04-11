'use client' // Error components must be Client Components
 
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function Error({ error }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    
    return (
        <div>
            <h2>Something went wrong!</h2>
            <Link 
            href={'/'}
            className='mt-5 px-5 py-2 uppercase w-full block text-center cursor-pointer border border-zinc-400 hover:bg-zinc-300'>
                Go Back
            </Link>
        </div>
    )
}