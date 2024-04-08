import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function HomepageSettings() {
    const navigate = useNavigate();
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        navigate('/')
    }
    
    const [media, setMedia] = useState<FileList>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<HomepageSettings>();
    const [categories, setCategories] = useState<Category[]>();
    const [value, setValue] = useState<any>([]);
    const [sale, setSale] = useState<boolean>(false);
    const [saleText, setSaleText] = useState<string>();

    const fetchCategories = async() => {
        await axios.get<Category[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
        .then((res) => {
            setCategories(res.data);
            fetchHomepageSettings();
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }

    const fetchHomepageSettings = async() => {
        await axios.get<HomepageSettings>(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
        .then((res) => {
            setSettings(res.data);
            setSale(res.data.sale);
            setSaleText(res.data.saleText);
            setValue(res.data.categories);
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        
        const formData = new FormData();
        if(media){
            Array.from(media).forEach(file => formData.append('media', file))
        }
        formData.append('categories', value);
        formData.append('sale', sale.toString()!);
        formData.append('saleText', saleText!);
        console.log(formData)

        await axios.post<void>(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage` , formData).then(res => {
            if(res.status === 201){
                setSuccessPrompt(true);
            }
        });
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
