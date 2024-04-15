'use client'

import { useEffect, useState } from "react"
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { Cookies } from "react-cookie";
import Link from "next/link";

export default function UserEditList() {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        redirect('/')
    }
    const [users, setUsers] = useState<User[]>();

    const getUsers = async() => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (res.ok) {
                const users = await res.json();
                setUsers(users)
            }
        }catch(err){
            return err
        }
    }

    useEffect(() => {
        getUsers();
    }, [])
    
    return (
        <div className="flex flex-col gap-2 mt-5">
        {users &&
        users.map((user: User) => (
            <Link 
            href={'users/' +user.id}
            key={user.id} 
            className="w-[250px] flex flex-col border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 p-4 cursor-pointer">
                <span className="border-b border-zinc-400 p-2">{user.firstName} {user.lastName}</span>
                <div className="flex flex-col p-2">
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                </div>
            </Link>
        ))}
        </div>
    )
}
