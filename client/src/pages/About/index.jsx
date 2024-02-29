import Gallery from './Gallery';
import OutdoorsImg from '../../assets/categories/outdoors.jpg';
import { Outlet } from 'react-router-dom';

function About() {
  return (
    <div className='flex flex-col overflow-hidden h-full'>
        <div>
        <img
        className='h-[100px] md:h-[400px] w-screen relative brightness-75'
        src={OutdoorsImg}
        alt="About Us Image"
        />
      </div>
      <div className="flex flex-col justify-evenly mx-auto mt-3 px-2">
        <Gallery title={'Our Values'} type={'posts'} />
        <Gallery title={'Our Team'} type={'users'}/>
        <Gallery title={'Our Partners'} type={'photos'} />
      </div>
      
    </div>
  )
}

export default About
