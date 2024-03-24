import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

export default function NavigationSettings() {
    const [settings, setSettings] = useState<NavigationSettings>();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>();
    const [value, setValue] = useState<any>([]);

    const fetchCategories = async() => {
        await axios.get<Category[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/`)
        .then((res) => {
            setCategories(res.data);
            fetchNavigationSettings();
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

    const fetchNavigationSettings = async() => {
        await axios.get<NavigationSettings>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/navigation`)
        .then((res) => {
            setSettings(res.data);
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

        await axios.post<void>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/navigation` , value).then(res => {
            if(res.status === 201){
                setSuccessPrompt(true);
            }
        });
    }

    return (
        <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
        {successPrompt ?
        <div className='font-semibold text-center mt-2 mb-4'>Navigation bar settings were updated.</div>
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
