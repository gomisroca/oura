'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { getCategorySettings } from "@/utils/settings";

interface Params {
    id: string;
}

export default function CategoryEdit({ params } : { params: Params }) {    
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        redirect('/')
    }
    
    const category = params.id;
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<HomepageSettings>();

    const fetchCategorySettings = async() => {
        setSettings(await getCategorySettings(category));
    }

    useEffect(() => {
        fetchCategorySettings();
    }, [category]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories/${category}`, {
            method: 'POST',
            body: formData
        })
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
        <div className="m-auto w-2/3 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Category {category} settings were updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Background Image
                </label>
                {settings?.image ?
                <div className="p-2 border border-zinc-400">
                    <span className="text-sm uppercase">Current Image</span>
                    <img src={settings.image} />
                </div>
                :
                
                <div className="p-2 border border-zinc-400 uppercase">
                    No image
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
