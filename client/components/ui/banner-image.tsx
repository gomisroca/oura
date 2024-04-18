'use client'

import Image from "next/image"
import PH from '@/public/images/ph_hbanner.png'
import { useEffect, useState } from "react";
import { getAboutSettings, getCategorySettings, getHomepageSettings, getSidebarSettings } from "@/utils/settings";
import { BannerSkeleton } from "../skeletons/banner-skeleton";

export function BannerImage({ type, gender, category, subcategory } : { type: string, gender?: string, category?: string, subcategory?: string }) {
    const [src, setSrc] = useState<string>();
    const [alt, setAlt] = useState<string>();
    const [saleText, setSaleText] = useState<string>();

    async function getCategory(gender: string){
        try{
            const data = await getCategorySettings(gender)
            setSrc(data.image)
        } catch(err){
            console.log(err)
        }
    }

    async function getAbout(){
        try{
            const data = await getAboutSettings()
            setSrc(data.image)
        } catch(err){
            console.log(err)
        }
    }

    async function getSaleText(){
        const homepageSettings: HomepageSettings | null = await getHomepageSettings();
        if(homepageSettings?.saleText){
            setSaleText(homepageSettings?.saleText)
        }
    }
    useEffect(() => {
        
        if(type == 'category' && gender){
            getCategory(gender)
            setAlt(gender + ' Banner')
            if(category == 'season'){
                getSaleText()
            }
        } else if (type == 'about'){
            getAbout()
            setAlt('About Banner')
        }
    })

    return (
        <>
        {src ?
        <div className='rounded-b-full overflow-hidden w-screen h-[150px] sm:h-[400px] bg-zinc-300 items-center justify-center flex'>
            <img
            className='w-screen brightness-75'
            src={src}
            alt={alt}
            />
            {subcategory ?
            <div>
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] ml-1 md:ml-4 text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                    {gender}
                </div> 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category == 'season' ? saleText : category}
                </div> 
                <div className='absolute uppercase text-[35px] md:text-[100px] text-zinc-200 ml-1 md:ml-3 self-center justify-self-center mt-[65px] md:mt-[230px]'>
                    {subcategory}
                </div> 
            </div>
            : category ? 
            <div>
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] ml-1 md:ml-4 text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                {gender}
                </div> 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category}
                </div>
            </div>
            : gender &&
            <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                {gender}
            </div>}
        </div>
        : <BannerSkeleton />}
        </>
    )
}