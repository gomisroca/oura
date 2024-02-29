import LandingImg from '../../assets/landing.jpg';
import { Link } from "react-router-dom";

function MobileLayout() {
    return (
        <div className='flex w-screen h-screen overflow-hidden text-white'>
            <img
            className='self-center relative h-screen right-[482px] max-w-none'
            src={LandingImg}
            alt="OURA Landing"
            />
            <div className='absolute bottom-2/4 right-3 text-center w-full text-[6rem] md:text-[5rem] font-semibold opacity-25'>OURA</div>
            <div className='absolute bottom-2/4 right-1.5 text-center w-full text-[6rem] md:text-[5rem] font-semibold opacity-50'>OURA</div>
            <div className='absolute bottom-2/4 text-center w-full text-[6rem] md:text-[5rem] font-semibold'>OURA</div>
            <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                <button className='border-2 border-white border-solid px-2 py-1 md:px-5 md:py-2 text-[1.5rem] md:text-[3rem] bg-black/50 font-semibold hover:bg-black/80 hover:text-zinc-300'>
                    <Link to="/season">SPRING COLLECTION</Link>
                </button>
            </div>
            {/* <div className='absolute bottom-0 grid w-full justify-items-center'>
                <svg className='animate-[bounce_2s_infinite] duration-700 w-20 h-20 z-10' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div> */}
        </div>
    )
  }
  
  export default MobileLayout