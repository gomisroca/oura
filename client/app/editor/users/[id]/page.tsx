'use client'

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { Cookies } from "react-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Params {
    id: string;
}

export default function UserEdit({ params } : { params: Params}) {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        redirect('/')
    }
    
    const id = params.id;
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [userInfo, setUser] = useState<User>();
    const [firstName, setFirstName] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [role, setRole] = useState<string>('BASIC');
    const [passCheck, setPassCheck] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string | undefined>();

    const getUser = async(id: string) => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if(res.ok){
                const user: User = await res.json();
                setUser(user);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                setRole(user.role);
            }
        } catch (err){
            console.log(err)
        }
    }

    useEffect(() => {
        getUser(id);
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        let formData: {
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            new_password?: string;
        } = {
            firstName: firstName!,
            lastName: lastName!,
            email: email!,
            role: role!,
        }
        if(passCheck && newPassword){
            formData.new_password = newPassword;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userInfo?.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData)
        })
        if(res.ok){
            setSuccessPrompt(true);
        }
    }

    const deleteUser = async() => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userInfo?.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if(res.ok){
            setSuccessPrompt(true);
        }
    }

    return (
        <div className="m-auto w-2/3 flex flex-col text-zinc-700 bg-zinc-200">
            {successPrompt ?
            <div className='font-semibold text-center mt-2 mb-4'>User {userInfo?.firstName} {userInfo?.lastName} was updated.</div>
            :
            <div className="flex flex-col gap-y-10">
                <form 
                method="post" 
                onSubmit={handleSubmit} 
                className="flex-col grid gap-y-4 p-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="firstName" className="uppercase font-bold">
                            First Name
                        </Label>
                        <Input 
                        className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                        value={firstName || ''}
                        onChange={(e) => { setFirstName(e.target.value) }}
                        name="firstName" 
                        type="text" /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="lastName" className="uppercase font-bold">
                            Last Name
                        </Label>
                        <Input 
                        className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                        value={lastName || ''}
                        onChange={(e) => { setLastName(e.target.value) }}
                        name="lastName" 
                        type="text" /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email" className="uppercase font-bold">
                            E-Mail
                        </Label>
                        <Input 
                        className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                        value={email || ''}
                        onChange={(e) => { setEmail(e.target.value) }}
                        name="email" 
                        type="text" /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="role" className="uppercase font-bold">
                            Role
                        </Label>
                        <select 
                        className="rounded-md transition duration-200 p-2 bg-zinc-200 border border-zinc-400  hover:border-zinc-500"
                        name="role"
                        value={role}
                        onChange={(e) => { setRole(e.target.value)}}
                        id="role">
                            <option value="BASIC">BASIC</option>
                            <option value="EDITOR">EDITOR</option>
                            <option value="SUPER">SUPER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className="flex flex-row">
                        <Label className="uppercase font-bold mr-4">
                            Set New Password? This could critically impact the user.
                        </Label>
                        <input 
                        checked={passCheck || false}
                        onChange={(e) => { setPassCheck(e.target.checked) }}
                        type="checkbox" 
                        name="passCheck"
                        className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                        />
                    </div>
                    {passCheck &&
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="password" className="uppercase font-bold">
                            Password
                        </Label>
                        <Input 
                        className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                        onChange={(e) => { setNewPassword(e.target.value) }}
                        name="newPassword" 
                        type="password" /> 
                    </div>}
                    <Button
                    variant="outline"
                    type="submit">
                        Update
                    </Button>
                </form>
                <Button 
                className="w-[100px] border-red-500 m-auto"
                variant="outline"
                onClick={() => deleteUser()}>
                    Delete User
                </Button>
            </div>
            }
        </div>
        )
}
