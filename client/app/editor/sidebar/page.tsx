'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { getSidebarSettings } from "@/utils/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SidebarSettings() {
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        redirect('/')
    }
    
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<SidebarSettings>();

    const fetchSidebarSettings = async() => {
        try{
            setSettings(await getSidebarSettings());
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchSidebarSettings();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/sidebar`, {
            method: 'POST',
            body: formData
        });
        if(res.ok){
            setSuccessPrompt(true);
        }
    }

    const uploadMedia = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            setMedia(event.target.files);
        }
    }
    
    return (
        <div className="m-auto w-2/3 flex flex-col text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Sidebar settings were updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
           <div className="flex flex-col gap-1">
                <Label htmlFor="image"  className="uppercase font-bold">
                    Image
                </Label>
                {settings?.image &&
                <div className="p-2 border border-zinc-400">
                    <span className="text-sm uppercase">Current Image</span>
                    <img className="m-auto max-w-[600px]" src={settings.image} />
                </div>}
                <Input 
                id="image"
                className="p-1 bg-zinc-200 border-zinc-400/80 border hover:border-zinc-600"
                type="file" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => uploadMedia(e)} />
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
