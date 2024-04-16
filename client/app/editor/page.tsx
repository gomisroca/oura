'use client'

import { useUser } from "@/contexts/user";
import Link from "next/link";

export default function EditorDashboard() {
    const { user } = useUser();
    return (
        <>
            <div className="m-auto flex flex-col items-center gap-2 mt-5">
                {user?.role !== 'BASIC' &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Products</span>
                    <div className="flex gap-2">
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/products'}>
                            Product List
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/products/upload'}>
                            Add Product
                        </Link>
                    </div>
                </div>}
                {(user?.role == 'SUPER' || user?.role == 'ADMIN') &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Display Settings</span>
                    <div className="grid grid-cols-2 gap-2">
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/homepage'}>
                            Homepage
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/categories'}>
                            Categories
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/navigation'}>
                            Navigation
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/sidebar'}>
                            Sidebar
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/about'}>
                            About
                        </Link>
                    </div>
                </div>}
                {user?.role == 'ADMIN' &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Users</span>
                    <div className="flex gap-2">
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/users/upload'}>
                            Add User
                        </Link>
                        <Link 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        href={'editor/users'}>
                            Edit User
                        </Link>
                    </div>
                </div>}
            </div>
        </>
    )
}
