'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function CategoriesSettings() {
    const { user } = useUser();
    if (user && (user?.role == 'BASIC' || user?.role == 'EDITOR')){
        redirect('/')
    }
    
    const [categories, setCategories] = useState<Category[]>();
    const [settings, setSettings] = useState<CategorySettings[]>();

    const fetchCategories = async() => {
        await axios.get<Category[]>(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
        .then((res) => {
            setCategories(res.data);
            console.log(res.data)
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

    const fetchCategorySettings = async() => {
        await axios.get<CategorySettings[]>(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories`)
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

    useEffect(() => {
        fetchCategories();
        fetchCategorySettings();
    }, []);
    
    return (
        <>
        <div className="mt-5 flex grid-cols-4 gap-2">
            {categories &&
            Object.entries(categories).map(([gender, categories]) => (
                <Link 
                href={'categories/' + gender}
                key={gender} 
                className="flex flex-col p-2 border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 cursor-pointer">
                    <div className="uppercase text-sm py-2">Gender: {gender}</div>
                    {Object.entries(categories).map(category => (
                        <div 
                        key={category[0]}
                        className="border-t border-zinc-400">
                            <div className="uppercase text-sm py-2">Category: {category[0]}</div>
                            {category[1].map((subcategory: string) => (
                                <div 
                                key={subcategory}
                                className="border-t border-zinc-400">
                                    <div className="uppercase text-sm py-2">Subcategory: {subcategory}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </Link>
            ))}
        </div>
        </>
    )
}
