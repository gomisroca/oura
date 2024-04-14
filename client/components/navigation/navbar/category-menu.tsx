'use client'

import { useEffect, useState } from "react";
import Menu from '@mui/material/Menu';
import Link from "next/link";

interface Props {
    gender: string;
    categories: Category;
}

export default function CategoryMenu({ gender, categories }: Props) {
    const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>();

    async function getSettings() {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`)
            if(!res.ok){
                return null
            }
            return res.json();
        } catch(err){
            console.log(err)
        }
    }

    async function setSettings() {
        setHomepageSettings(await getSettings())
    }

    useEffect(() => {
        setSettings();
    }, []);
    
    // Main Menus
    const [mainMenuEl, setMainMenuEl] = useState<null | HTMLElement>(null);
    const openMainMenu = Boolean(mainMenuEl);
    const handleMainMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        setMainMenuEl(event.currentTarget);
    };
    const handleMainMenuClose = () => {
        setMainMenuEl(null);
    };

    // Sub Menu
    const [subMenuEl, setSubMenuEl] = useState<null | HTMLElement>(null);
    const [subMenuKey, setSubMenuKey] = useState<string>();
    const openSubMenu = Boolean(subMenuEl);
    const handleSubMenu = (event: React.MouseEvent<HTMLDivElement>, key: string) => {
        setSubMenuKey(key)
        setSubMenuEl(event.currentTarget);
    };
    const handleSubMenuClose = () => {
        setSubMenuEl(null);
    };

    return (
        <>
        <div
        className='hover:bg-zinc-300 px-2 cursor-pointer ml-2 z-50 flex items-center'
        aria-controls={openMainMenu ? 'main-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMainMenu ? 'true' : undefined}
        onClick={handleMainMenu}>
            {gender &&
            <span className="uppercase text-[0.75rem] md:text-[1rem]">{gender}</span>
            }
        </div>
        <Menu
        PaperProps={{ sx: { borderRadius: 0 } }}
        MenuListProps={{ sx: { py: 0 } }}
        anchorEl={mainMenuEl}
        open={openMainMenu}
        onClose={handleMainMenuClose}>
            <div className="flex flex-col">
                {homepageSettings?.sale &&
                <Link 
                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300 text-rose-500 font-bolder cursor-pointer" 
                href={`/category/${gender.toLowerCase()}/season`}>
                    <span className="uppercase text-lg">
                        {homepageSettings.saleText}
                    </span>
                </Link>}
                <Link 
                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300 cursor-pointer" 
                href={`/category/${gender.toLowerCase()}`}>
                    <span className="uppercase text-sm">
                        All
                    </span>
                </Link>
                {categories && 
                Object.entries(categories).map(subcategory => (
                <div key={subcategory[0]}>
                    <div   
                    className='hover:bg-zinc-300 cursor-pointer p-2 border-b-2 border-zinc-400'
                    aria-controls={openSubMenu ? subcategory[0] : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu ? 'true' : undefined}
                    onClick={(event) => handleSubMenu(event, subcategory[0])}>
                        <span className="uppercase text-sm">
                            {subcategory[0]}
                        </span>
                    </div>
                    <Menu
                    PaperProps={{ sx: { borderRadius: 0 } }}
                    MenuListProps={{ sx: { py: 0 } }}
                    id={subcategory[0]}
                    anchorEl={subMenuEl}
                    open={openSubMenu && subMenuKey === subcategory[0]}
                    onClose={handleSubMenuClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}>
                        <div className="flex flex-col">
                            <Link 
                            className="p-2 border-b-2 border-zinc-400 cursor-pointer hover:bg-zinc-300"
                            href={`/category/${gender.toLowerCase()}/${subcategory[0].toLowerCase()}`}>
                                <span className="uppercase text-sm">All</span>
                            </Link>
                            {subcategory[1].map((sub: string) => (
                                <Link 
                                key={sub} 
                                className="p-2 border-b-2 border-zinc-400 cursor-pointer hover:bg-zinc-300"
                                href={`/category/${gender.toLowerCase()}/${subcategory[0].toLowerCase()}/${sub.toLowerCase()}`}>
                                    <span className="uppercase text-sm">{sub}</span>
                                </Link>
                            ))}
                        </div>
                    </Menu>
                </div>
                ))}
            </div>
        </Menu>
        </>
    );
}