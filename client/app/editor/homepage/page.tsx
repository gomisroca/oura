'use client'

import { Autocomplete, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";

export default function HomepageSettings() {
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        redirect('/')
    }
    
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<HomepageSettings>();
    const [categories, setCategories] = useState<Category[]>();
    const [value, setValue] = useState<any>([]);
    const [sale, setSale] = useState<boolean>(false);
    const [saleText, setSaleText] = useState<string>();

    const fetchCategories = async() =>  {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
            if(res.ok){
                const data = await res.json();
                console.log(data)
                setCategories(data);
                fetchHomepageSettings()
            }
        } catch(err){
            console.log(err)
        }
    }

    const fetchHomepageSettings = async() => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
            if(res.ok){
                const data = await res.json()
                setSettings(data);
                setSale(data.sale);
                setSaleText(data.saleText);
                setValue(data.categories)
            }
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            formData.append('image', media[0])
        }
        formData.append('categories', value);
        formData.append('sale', sale.toString()!);
        formData.append('saleText', saleText!);
        console.log(formData)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`, {
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
        <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Homepage settings were updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Categories Displayed
                </label>
                {categories &&
                <Autocomplete
                multiple
                id="categories"
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                options={Object.keys(categories).map(gender => gender.toUpperCase())}
                renderInput={(params) => <TextField {...params} />}
                />}
            </div>
            <div className="flex flex-row">
                <label className="uppercase font-bold mr-4">
                    Sale/Season?
                </label>
                <input 
                checked={sale || false}
                onChange={(e) => { setSale(e.target.checked) }}
                type="checkbox" 
                name="sale"
                className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                />
            </div>
            {sale &&
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Sale Text
                </label>
                <input 
                value={saleText || ''}
                onChange={(e) => { setSaleText(e.target.value) }}
                name="saleText" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>}
            <div className="flex flex-col">
                <label className="uppercase font-bold mb-2">
                    Background Image
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
