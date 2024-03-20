import UserMenu from "./UserMenu/index";

import { useNavigate } from "react-router-dom";
import CategoryMenu from "./CategoryMenu";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NavMenu() {
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState<Category[]>();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/catalog`)
        .then((res) => {
            setCategoryData(res.data);
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }, []);

    return (
        <>
        <div 
        id="sidebar" 
        className="flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow">
            <div 
            className="px-2 font-semibold subpixel-antialiased text-[0.9rem] md:text-[1.2rem] hover:text-zinc-800 cursor-pointer" 
            onClick={() => navigate('')}>
                OURA
            </div>
            <div className="my-auto flex flex-row items-center">
                {categoryData &&
                categoryData.slice(0,3).map(category => (
                    <CategoryMenu category={category} />
                ))
                }
            </div>
            <div className="absolute right-0 self-center">
                <UserMenu />
            </div>
        </div>
        </>
    );
}