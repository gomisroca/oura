import UserMenu from "./UserMenu/index";

import { useNavigate } from "react-router-dom";
import CategoryMenu from "./CategoryMenu";

export default function NavMenu() {
    const navigate = useNavigate();

    return (
        <>
        <div 
        id="sidebar" 
        className="flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow">
            <div 
            className="px-2 font-semibold subpixel-antialiased text-[1.2rem] hover:text-zinc-800 cursor-pointer" 
            onClick={() => navigate('')}>
                OURA
            </div>
            <div className="my-auto flex flex-row">
                <CategoryMenu category='man' />
                <CategoryMenu category='woman' />
            </div>
            <div className="absolute right-0 self-center">
                <UserMenu />
            </div>
        </div>
        </>
    );
}