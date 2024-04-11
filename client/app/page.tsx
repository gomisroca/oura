import Image from "next/image";
import Link from "next/link";
import LandingPlaceholder from '../public/images/ph_landing.png'
import { Antonio } from 'next/font/google'
 
const antonio = Antonio({ subsets: ['latin'] })

async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
    if(!res.ok){
        return null
    }

    return res.json();
}

async function Landing() {
    const settings: HomepageSettings = await getData();

    return (
        <>
            <div className={antonio.className + ' flex w-screen h-screen text-zinc-200 overflow-hidden justify-center items-center'}>
                <div className='flex relative overflow-y-hidden h-full md:w-[100vw] justify-center items-center'>
                    <img
                    className="h-full max-w-none"
                    src={settings && settings.image ? settings.image  : LandingPlaceholder.src}
                    alt="OURA Landing"
                    />
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
                <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                    {settings.sale &&
                    <span className='px-2 py-1 md:px-5 md:py-2 text-[1rem] md:text-[3rem] font-semibold'>
                        {settings.saleText.toUpperCase()}
                    </span>}
                    <div className='flex flex-row'>
                        {settings.categories &&
                        settings.categories.map(gender => (
                        <Link 
                        key={gender}
                        className='text-center border-2 border-zinc-200 hover:border-zinc-300 border-solid px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300 font-semibold w-[300px]'
                        href={`/category/${gender.toLowerCase()}/season`}>
                            {gender.toUpperCase()}
                        </Link>
                        ))}
                    </div>
                </div>}
            </div>
        </>
    )
}
  
export default Landing