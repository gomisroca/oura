import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavMenu from './navigation/NavMenu';
import { v4 as uuidv4 } from 'uuid';
import useIsMobile from "../hooks/useIsMobile";

function Root() {
  let session = localStorage.getItem('oura_session');
  if(!session){
    localStorage.setItem('oura_session', uuidv4());
  }
  return (
    <div className="absolute top-0 flex flex-col bg-gradient-to-br from-white via-white to-gray-400 w-full min-h-full">
        <div className="top-0 w-full left-0 sticky z-10">
          <NavMenu />
        </div>
        <div className="flex items-center justify-center pb-4 mb-16">
          <Outlet context={useIsMobile()} />
        </div>
        <div className="absolute bottom-0 w-full left-0 z-10">
          <Footer />
        </div>
    </div>
  )
}

export default Root
