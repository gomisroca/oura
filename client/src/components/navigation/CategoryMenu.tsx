import { useState } from "react";
import Menu from '@mui/material/Menu';
import { useNavigate } from "react-router-dom";

interface Props {
    gender: string;
    categories: Category;
}

export default function CategoryMenu({ gender, categories }: Props) {
    const navigate = useNavigate();

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
                <div 
                className="p-2 border-b-2 border-green-500/20 bg-green-200 hover:bg-green-300 cursor-pointer" 
                onClick={() => navigate(`${gender}/season`)}>
                    <span className="uppercase text-sm">
                        Season
                    </span>
                </div>
                <div 
                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300 cursor-pointer" 
                onClick={() => navigate(`${gender}`)}>
                    <span className="uppercase text-sm">
                        All
                    </span>
                </div>
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
                            <div 
                            className="p-2 border-b-2 border-zinc-400 cursor-pointer hover:bg-zinc-300"
                            onClick={() => navigate(`${gender}/${subcategory[0]}`)}>
                                <span className="uppercase text-sm">All</span>
                            </div>
                            {subcategory[1].map((sub: string) => (
                                <div 
                                key={sub} 
                                className="p-2 border-b-2 border-zinc-400 cursor-pointer hover:bg-zinc-300"
                                onClick={() => navigate(`${gender}/${subcategory[0]}/${sub}`)}>
                                    <span className="uppercase text-sm">{sub}</span>
                                </div>
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