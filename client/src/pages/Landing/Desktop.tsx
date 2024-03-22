import LandingImg from '../../assets/landing.jpg';
import { useNavigate } from "react-router-dom";

interface Props {
    categories: Category[];
}

function DesktopLayout({ categories }: Props) {
    const navigate = useNavigate();

    return (
        <div className='flex text-zinc-200 overflow-hidden justify-center items-center'>
            <div className='flex overflow-y-hidden h-full justify-center items-center'>
                <img
                className='h-[100vh] max-w-[unset]'
                src={LandingImg}
                alt="OURA Landing"
                />
            </div>
            <div className='absolute bottom-2/4 right-4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-30'>
                OURA
            </div>
            <div className='absolute bottom-2/4 right-2 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-60'>
                OURA
            </div>
            <div className='absolute bottom-2/4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold'>
                OURA
            </div>
            <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                <span className='px-2 py-1 md:px-5 md:py-2 text-[1rem] md:text-[3rem] font-semibold'>
                    SPRING COLLECTION
                </span>
                <div className='flex flex-row'>
                    {categories &&
                    Object.keys(categories).map(gender => (
                        <button 
                        className='border-2 border-zinc-200 hover:border-zinc-300 border-solid px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300 font-semibold w-[300px]'
                        onClick={() => navigate(`/${gender}/season`)}>
                            {gender.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
  }
  
  export default DesktopLayout