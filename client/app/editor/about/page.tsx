'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { getAboutSettings } from "@/utils/settings";

export default function AboutSettings() {
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        redirect('/')
    }
    
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<AboutSettings>();

    const fetchAboutSettings = async() => {
        try{
            setSettings(await getAboutSettings());
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchAboutSettings();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
            try{
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`, {
                    method: 'POST',
                    body: formData
                }); 
                if(res.ok){
                    setSuccessPrompt(true);
                }
            }catch(err){
                console.log(err)
            }
        }
    }

    const uploadMedia = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            setMedia(event.target.files);
        }
    }
    
    return (
        <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>About settings were updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Banner Image
                </label>
                {settings?.image &&
                <div className="p-2 border border-zinc-400">
                    <span className="text-sm uppercase">Current Image</span>
                    <img src={settings.image} />
                </div>}
                <input 
                type="file" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => uploadMedia(e)}
                className="mt-2 block cursor-pointer p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" />
            </div>
            <button 
            type="submit" 
            className="uppercase font-bold py-4 hover:bg-zinc-300 transition duration-200 w-full m-auto">
                Update
            </button>
        </form>
        }
    </div>
    )
}
