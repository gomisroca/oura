'use client'

import { useEffect, useState } from "react"
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { Cookies } from "react-cookie";
import Link from "next/link";
import { Card } from "@/components/ui/card";

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
        <div className="m-auto flex grid-cols-5 gap-2">
        {users &&
        users.map((user: User) => (
            <Card className="p-4">
                <Link 
                href={'users/' +user.id}
                key={user.id} 
                className="w-[250px]">
                    <span className="border-b border-zinc-400 p-2">{user.firstName} {user.lastName}</span>
                    <div className="flex flex-col p-2">
                        <span>{user.email}</span>
                        <span>{user.role}</span>
                    </div>
                </Link>
            </Card>
        ))}
        </div>
    )
}
