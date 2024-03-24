import UserMenu from "./UserMenu/index";

import { useNavigate } from "react-router-dom";
import CategoryMenu from "./CategoryMenu";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NavMenu() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category>();
    const [filteredCategories, setFilteredCategories] = useState<Category>();
    const [settings, setSettings] = useState<NavigationSettings>();

    const fetchNavigationSettings = async() => {
        await axios.get<NavigationSettings>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/navigation`)
        .then((res) => {
            setSettings(res.data);
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

    const fetchCategories = async() => {
        await axios.get<Category[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/`)
        .then((res) => {
            setCategories(res.data);
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

    const filterCategories = async() => {
        let filteredCategories: Category = {};
        settings?.categories.forEach((category: string) => {
            const cat = category.toLocaleLowerCase();
            if (categories && categories[cat]) {
                const categoryObject = categories[cat];
                if (!filteredCategories[cat]) {
                    // If the category key doesn't exist in 'filteredCategories', create it as an array
                    filteredCategories[cat] = categoryObject;
                } else {
                   // If the category key already exists, push the categoryObject into the array
                    filteredCategories[cat].push(categoryObject);
                }
            }
        })
        if(filteredCategories){
            console.log(filteredCategories)
            setFilteredCategories(filteredCategories)
        }
    }
    useEffect(() => {
        fetchNavigationSettings();
        fetchCategories();
    }, []);

    useEffect(() => {
        if(categories && settings && !filteredCategories){
            filterCategories();
        }
    }, [categories, settings]);

    return (
        <>
        <div 
        id="sidebar" 
        className="flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow">
            <div 
            className="px-2 font-semibold subpixel-antialiased text-[0.9rem] md:text-[1.2rem] hover:text-zinc-800 cursor-pointer" 
            onClick={() => navigate('')}>
                OURA
            </div>
            <div className="my-auto flex flex-row items-center">
                {filteredCategories &&
                Object.entries(filteredCategories).map(([gender, categories]) => (
                    <CategoryMenu key={gender} gender={gender} categories={categories} />
                ))}
            </div>
            <div className="absolute right-0 self-center">
                <UserMenu />
            </div>
        </div>
        </>
    );
}