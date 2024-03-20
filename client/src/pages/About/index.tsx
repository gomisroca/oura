import Gallery from './Gallery';
import OutdoorsImg from '../../assets/categories/outdoors.jpg';

function About() {
    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <div className='h-[100px] md:h-[400px]'>
                <img
                className='w-screen brightness-75'
                src={OutdoorsImg}
                alt="About Us Image"
                />
            </div>
            <div className="bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-300 z-[1] flex flex-col justify-evenly mx-auto my-4 px-2">
                <Gallery title={'Our Values'} type={'posts'} />
                <Gallery title={'Our Team'} type={'users'}/>
                <Gallery title={'Our Partners'} type={'photos'} />
            </div>
        </div>
    )
}

export default About
