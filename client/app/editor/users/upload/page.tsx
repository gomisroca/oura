'use client'

import axios from "axios";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUser } from "@/contexts/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function UserUpload() {
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        redirect('/')
    }
    
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        let formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            role: 'BASIC',
            password: form.password.value,
        }
      
        console.log(formData)

        await axios.post<void>(`${process.env.NEXT_PUBLIC_API_URL}/users/register` , formData).then(res => {
            if(res.status === 200){
                setSuccessPrompt(true);
            }
        });
    }
    
    return (
        <div className="m-auto w-3/4 lg:w-2/3 flex flex-col text-zinc-700 bg-zinc-200">
            {successPrompt ?
            <div className='font-semibold text-center mt-2 mb-4'>User was uploaded.</div>
            :
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
                    name="firstName" 
                    type="text" /> 
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="lastName" className="uppercase font-bold">
                        Last Name
                    </Label>
                    <Input 
                    className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                    name="lastName" 
                    type="text"/> 
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email" className="uppercase font-bold">
                        E-Mail
                    </Label>
                    <Input 
                    className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                    name="email" 
                    type="text" /> 
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="password" className="uppercase font-bold">
                        Password
                    </Label>
                    <Input 
                    className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                    name="password" 
                    type="text" /> 
                </div>
                <Button
                variant="outline" 
                type="submit">
                    Update
                </Button>
            </form>
            }
        </div>
    )
}
