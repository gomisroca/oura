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
        <div className='rounded-b-full overflow-hidden w-screen h-[6.5rem] md:h-[10rem] lg:h-[15rem] xl:h-[20rem] bg-zinc-300 items-center justify-center flex'>
            <img
            className='w-screen brightness-75'
            src={src}
            alt={alt}
            />
            {subcategory ?
            <div className="absolute flex flex-row items-center gap-1 mt-12 sm:mt-10 lg:mt-0">
                <div className='text-shadow-sm cursor-default uppercase text-[1rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div> 
                <div className='text-shadow-lg cursor-default uppercase text-[2rem] md:text-[4rem] lg:text-[5rem] xl:text-[7rem] text-zinc-200 self-center justify-self-center'>
                    {category == 'season' ? saleText : category}
                </div> 
                <div className='text-shadow-sm uppercase text-[1rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] text-zinc-200 self-center justify-self-center'>
                    {subcategory}
                </div> 
            </div>
            : category ? 
            <div className="absolute flex flex-col mt-12 sm:mt-10 lg:mt-6">
                <div className='text-shadow-sm cursor-default uppercase text-[0.8rem] md:text-[1.5rem] lg:text-[2.5rem] xl:text-[3rem] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div> 
                <div className='text-shadow-lg cursor-default uppercase text-[1.5rem] md:text-[2.5rem] lg:text-[5rem] xl:text-[6rem] text-zinc-200 self-center justify-self-center'>
                    {category == 'season' ? saleText : category}
                </div>
            </div>
            : gender &&
            <div className="absolute flex flex-col mt-12 sm:mt-10 lg:mt-0">
                <div className='text-shadow-lg cursor-default uppercase text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[9rem] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div>
            </div>}
        </div>
        : <BannerSkeleton />}
        </>
    )
}