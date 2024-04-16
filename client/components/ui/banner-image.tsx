'use client'

import Image from "next/image"
import PH from '@/public/images/ph_hbanner.png'
import { useEffect, useState } from "react";
import { getAboutSettings, getCategorySettings, getSidebarSettings } from "@/utils/settings";

export function BannerImage({ type, gender } : { type: string, gender?: string }) {
    const [src, setSrc] = useState<string>();
    const [alt, setAlt] = useState<string>();

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

    async function getSidebar() {
        try{
            const data = await getSidebarSettings()
            setSrc(data.image)
        } catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        if(type == 'category' && gender){
            getCategory(gender)
            setAlt(gender + ' Banner')
        } else if (type == 'about'){
            getAbout()
            setAlt('About Banner')
        } else if (type == 'sidebar'){
            getSidebar()
            setAlt('Sidebar Banner')
        }
    })

    return (
        <>
            {src ?
            <img
            className='w-screen brightness-75'
            src={src}
            alt={alt}
            />
            :
            <img
            className='w-screen brightness-75'
            src={PH.src}
            alt={alt}
            />}
        </>
    )
}