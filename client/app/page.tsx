'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LandingPlaceholder from '../public/images/ph_landing.png'

function Landing() {
    const { push } = useRouter();
    const [settings, setSettings] = useState<HomepageSettings | null>(null);

    const fetchHomepageSettings = async() => {
        await axios.get<HomepageSettings>(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
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
        fetchHomepageSettings();
    }, []);

    return (
        <div className='flex w-screen h-screen text-zinc-200 overflow-hidden justify-center items-center'>
            <div className='flex relative overflow-y-hidden h-full md:w-[100vw] justify-center items-center'>
                <Image
                width={1920}
                sizes="(max-width: 768px) 1920px, 100vw"
                className="h-full max-w-none"
                src={settings && settings.image ? settings.image  : LandingPlaceholder}
                alt="OURA Landing"
                />
            </div>
            <div className='drop-shadow-xl absolute bottom-2/4 right-2 md:right-4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-30'>
                OURA
            </div>
            <div className='drop-shadow-xl absolute bottom-2/4 right-1 md:right-2 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-60'>
                OURA
            </div>
            <div className='drop-shadow-xl absolute bottom-2/4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold'>
                OURA
            </div>
            {settings &&
            <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                {settings.sale &&
                <span className='px-2 py-1 md:px-5 md:py-2 text-[1rem] md:text-[3rem] font-semibold'>
                    {settings.saleText.toUpperCase()}
                </span>}
                <div className='flex flex-row'>
                    {settings.categories &&
                    settings.categories.map(gender => (
                        <button 
                        className='border-2 border-zinc-200 hover:border-zinc-300 border-solid px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300 font-semibold w-[300px]'
                        onClick={() => push(`/${gender.toLowerCase()}/season`)}>
                            {gender.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>}
        </div>
    )
}
  
export default Landing