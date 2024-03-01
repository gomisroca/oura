import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import NavMenu from './navigation/NavMenu';

import useIsMobile from "../hooks/useIsMobile";
import { UserProvider } from "../contexts/UserContext";

function Root() {
  return (
    <UserProvider>
        <div className="absolute top-0 flex flex-col bg-gradient-to-br from-zinc-200 via-zinc-200 to-zinc-300 w-full min-h-full">
            <div className="top-0 w-full left-0 sticky z-10">
                <NavMenu />
            </div>
            <div className="relative flex items-center justify-center">
                <Outlet context={useIsMobile()} />
            </div>
            {!useIsMobile() ?            
            <div className="absolute bottom-0 w-full left-0 z-10">
                <Footer />
            </div>
            : null}
        </div>
    </UserProvider>
  )
}

export default Root
