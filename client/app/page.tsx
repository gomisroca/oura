import Image from "next/image";
import Link from "next/link";
import LandingPlaceholder from '@/public/images/ph_landing.png'
import { Antonio } from 'next/font/google'
import { HomepageSettings } from "@prisma/client";
import { getHomepageSettings } from "@/utils/settings";
import { Card } from "@/components/ui/card";
 
const antonio = Antonio({ subsets: ['latin'] })

async function Landing() {
    const settings: HomepageSettings | null = await getHomepageSettings();
    
    return (
        <>
            <div className={antonio.className + ' flex w-screen text-zinc-200 overflow-hidden justify-center items-center'}>
                <div className='h-full overflow-hidden flex md:w-full justify-center items-center'>
                    {settings && settings.image ?
                    <Image
                    fill
                    className="max-w-none h-auto"
                    src={settings.image}
                    alt="OURA Landing"
                    />
                    :
                    <Image
                    fill
                    className="max-w-full h-auto"
                    src={LandingPlaceholder}
                    alt="OURA Landing"
                    />}
                </div>
                <div className='drop-shadow-xl absolute bottom-2/4 right-2 md:right-4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[12rem] font-semibold opacity-30'>
                    OURA
                </div>
                <div className='drop-shadow-xl absolute bottom-2/4 right-1 md:right-2 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[12rem] font-semibold opacity-60'>
                    OURA
                </div>
                <div className='drop-shadow-xl absolute bottom-2/4 text-center w-full text-[4rem] md:text-[7rem] 2xl:text-[12rem] font-semibold'>
                    OURA
                </div>
                {settings &&
                <div className='absolute self-center mt-[150px] w-full grid justify-items-center'>
                    {settings.sale &&
                    <span className='px-2 py-1 md:px-5 md:py-2 text-[1rem] md:text-[3rem] font-semibold'>
                        {settings.saleText?.toUpperCase()}
                    </span>}
                    <div className='flex flex-row'>
                        {settings.categories &&
                        settings.categories.map(gender => (
                        <Card className="flex hover:border-zinc-100 text-zinc-300 hover:text-zinc-100 bg-gradient-to-br from-zinc-600 via-zinc-400/20 to-zinc-300/10" style={{backgroundImage: `url(${settings.saleImage})`}}>
                            <Link 
                            key={gender}
                            className='rounded-md text-center px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-gradient-to-br from-zinc-800 via-zinc-600/20 to-zinc-300/10  hover:from-zinc-800 hover:via-zinc-600/10 font-semibold w-[300px] transition duration-200'
                            href={`/category/${gender.toLowerCase()}/season`}>
                                {gender.toUpperCase()}
                            </Link>
                        </Card>
                        ))}
                    </div>
                </div>}
            </div>
        </>
    )
}
  
export default Landing