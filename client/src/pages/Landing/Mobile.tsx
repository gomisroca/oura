import LandingImg from '../../assets/landing.jpg';
import { useNavigate } from "react-router-dom";
import LandingPlaceholder from '../../assets/ph_landing.png';

interface Props {
    settings: HomepageSettings;
}

function MobileLayout({ settings }: Props) {
    const navigate = useNavigate();
    
    return (
        <div className='flex w-screen h-screen overflow-hidden text-zinc-200'>
            <img
            className='self-center relative h-screen right-[482px] max-w-none'
            src={settings && settings.image ? settings.image  : LandingPlaceholder}
            alt="OURA Landing"
            />
            <div className='absolute bottom-2/4 right-3 text-center w-full text-[6rem] md:text-[5rem] font-semibold opacity-25'>
                OURA
            </div>
            <div className='absolute bottom-2/4 right-1.5 text-center w-full text-[6rem] md:text-[5rem] font-semibold opacity-50'>
                OURA
            </div>
            <div className='absolute bottom-2/4 text-center w-full text-[6rem] md:text-[5rem] font-semibold'>
                OURA
            </div>
            <div className='absolute self-center mt-[150px] w-full grid justify-items-center'>
                {settings.sale &&
                <span className='px-2 py-1 md:px-5 md:py-2 text-[1.5rem] md:text-[3rem] font-semibold'>
                    {settings.saleText.toUpperCase()}
                </span>}
                <div className='flex flex-col gap-4'>
                    {settings.categories &&
                    settings.categories.map(gender => (
                        <button 
                        className='border-2 border-zinc-200 hover:border-zinc-300 border-solid p-2 md:px-5 text-[1.5rem] md:text-[3rem] bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300 font-semibold w-[300px]'
                        onClick={() => navigate(`/${gender.toLowerCase()}/season`)}>
                            {gender.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
  }
  
  export default MobileLayout