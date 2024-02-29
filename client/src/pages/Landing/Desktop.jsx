import LandingImg from '../../assets/landing.jpg';
import { Link } from "react-router-dom";

function DesktopLayout() {
    const genderLinks = ["Man", "Woman"];
    const sportLinks = ["Running", "Hiking", "Cycling", "Fitness"];
    
    return (
        <div className='flex text-white'>
            <img
            src={LandingImg}
            alt="OURA Landing"
            />
            <div className='absolute bottom-2/4 right-4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-30'>OURA</div>
            <div className='absolute bottom-2/4 right-2 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold opacity-60'>OURA</div>
            <div className='absolute bottom-2/4 text-center w-full text-[4rem] md:text-[5rem] 2xl:text-[10rem] font-semibold'>OURA</div>
            <div className='absolute self-center mt-16 w-full grid justify-items-center'>
                <span className='px-2 py-1 md:px-5 md:py-2 text-[1rem] md:text-[3rem] font-semibold'>
                    SPRING COLLECTION
                </span>
                <div className='flex flex-row'>
                    <button className='border-2 border-white border-solid px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-black/30 font-semibold hover:bg-black/60 hover:text-zinc-300'>
                        <Link to="/male/season">MAN</Link>
                    </button>
                    <button className='border-2 border-white border-solid px-2 py-1 md:px-5 text-[1rem] md:text-[3rem] bg-black/30 font-semibold hover:bg-black/60 hover:text-zinc-300'>
                        <Link to="/female/season">WOMAN</Link>
                    </button>
                </div>
            </div>
            <div className='absolute self-center text-end right-1 lg:text-[1rem] 2xl:text-[2rem] hidden lg:block'>
                {genderLinks.map(link => (
                <div key={link} className="ml-2 pl-2 hover:bg-white/5">
                <Link className='hover:text-zinc-300' to={`/${link.toLowerCase()}`}>{link.toUpperCase()}</Link>
                </div>
                ))}

                <br />

                {sportLinks.map(link => (
                <div key={link} className="ml-2 pl-2 hover:bg-white/5">
                    <Link className='hover:text-zinc-300' to={`/${link.toLowerCase()}`}>{link.toUpperCase()}</Link>
                </div>
                ))}
            </div>
        </div>
    )
  }
  
  export default DesktopLayout