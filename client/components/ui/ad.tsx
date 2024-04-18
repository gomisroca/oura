'use client'

import { useEffect, useState } from "react";
import { getSidebarSettings } from "@/utils/settings";
import { AdSkeleton } from "../skeletons/ad-skeleton";

export function AdImage() {
    const [src, setSrc] = useState<string>();
    const [alt, setAlt] = useState<string>();

    async function getSidebar() {
        try{
            const data = await getSidebarSettings()
            setSrc(data.image)
        } catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        getSidebar()
        setAlt('Sidebar Banner')
    })

    return (
        <>
        {src ?
        <img
        className='rounded-md w-screen brightness-75'
        src={src}
        alt={alt}
        />
        : <AdSkeleton />}
        </>
    )
}