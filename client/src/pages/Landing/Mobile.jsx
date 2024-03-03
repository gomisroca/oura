import LandingImg from '../../assets/landing.jpg';
import { useNavigate } from "react-router-dom";

function MobileLayout() {
    const navigate = useNavigate();
    
    return (
        <div className='flex w-screen h-screen overflow-hidden text-zinc-200'>
            <img
            className='self-center relative h-screen right-[482px] max-w-none'
            src={LandingImg}
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
            <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                <button 
                className='border-2 border-zinc-400 border-solid px-2 py-1 md:px-5 md:py-2 text-[1.5rem] md:text-[3rem] font-semibold bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-zinc-300'
                onClick={() => navigate('/season')}>
                    SPRING COLLECTION
                </button>
            </div>
        </div>
    )
  }
  
  export default MobileLayout