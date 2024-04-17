'use client'

import { Autocomplete, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import { redirect } from "next/navigation";
import { getHomepageSettings } from "@/utils/settings";
import { getCategories } from "@/utils/categories";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            setCategories(await getCategories());
            fetchHomepageSettings()
        } catch(err){
            console.log(err)
        }
    }

    const fetchHomepageSettings = async() => {
        try{
            const data = await getHomepageSettings();
            setSettings(data);
            setSale(data.sale);
            setSaleText(data.saleText);
            setValue(data.categories)
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
        <div className="m-auto w-2/3 flex flex-col text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Homepage settings were updated.</div>
        :
        <form 
        method="post" 
        onSubmit={handleSubmit} 
        className="flex-col grid gap-y-4 p-4">
            <div className="flex flex-col">
                <Label className="uppercase font-bold mb-2">
                    Categories Displayed
                </Label>
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
                <Label className="uppercase font-bold mr-4">
                    Sale/Season?
                </Label>
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
                <Label className="uppercase font-bold mb-2">
                    Sale Text
                </Label>
                <Input 
                value={saleText || ''}
                onChange={(e) => { setSaleText(e.target.value) }}
                name="saleText" 
                type="text"
                className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
            </div>}
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
            variant='outline'
            type="submit">
                Update
            </Button>
    </form>
        }
    </div>
    )
}
