'use client'

import UserWrapper from "@/components/navigation/navbar/user-wrapper";
import CategoryMenu from "@/components/navigation/navbar/category-menu";
import Link from "next/link";
import { Urbanist } from 'next/font/google'
import { useEffect, useState } from "react";
 
const urbanist = Urbanist({
    subsets: ['latin'],
    display: 'swap',
    weight: '600'
})

async function getCategories(){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
        if(!res.ok){
            return null
        }

        return res.json();
    } catch(err){
        console.log(err)
    }
}

async function getSettings(){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/navigation`)
        if(!res.ok){
            return null
        }

        return res.json();
    } catch(err){
        console.log(err)
    }
}

export default function Navbar() {
    const [filteredCategories, setFilteredCategories] = useState<Category>();

    async function getData() {
        const categories = await getCategories();
        const settings = await getSettings();
        let filteredCategories: Category = {};
        if(categories && settings){
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
        }
        setFilteredCategories(filteredCategories)
    }

    useEffect(() => {
        getData();
    }, [])
    
    return (
        <>
        <div className={urbanist.className + " sticky flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow"}>
            <Link 
            className="px-2 font-semibold subpixel-antialiased text-[0.9rem] md:text-[1.2rem] hover:text-zinc-800 cursor-pointer"
            href={'/'}>
                OURA
            </Link>
            <div className="my-auto flex flex-row items-center">
                {filteredCategories &&
                Object.entries(filteredCategories).map(([gender, categories]) => (
                    <CategoryMenu key={gender} gender={gender} categories={categories} />
                ))}
            </div>
            <div className="absolute right-0 self-center">
                <UserWrapper />
            </div>
        </div>
        </>
    );
}