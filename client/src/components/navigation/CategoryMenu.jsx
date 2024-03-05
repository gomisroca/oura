import { useState, useEffect } from "react";
import Menu from '@mui/material/Menu';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function CategoryMenu({ category }) {
    const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState([]);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/catalog`)
        .then((res) => {
            setCategoryData((res.data).find(x => x.genre == category).classes);
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
    }, [category]);

    // Main Menus
    const [mainMenuEl, setMainMenuEl] = useState(null);
    const openMainMenu = Boolean(mainMenuEl);
    const handleMainMenu = (event) => {
        setMainMenuEl(event.currentTarget);
    };
    const handleMainMenuClose = () => {
        setMainMenuEl(null);
    };

    // Sub Menu
    const [subMenuEl, setSubMenuEl] = useState(null);
    const [subMenuKey, setSubMenuKey] = useState(null);
    const openSubMenu = Boolean(subMenuEl);
    const handleSubMenu = (event, key) => {
        setSubMenuKey(key)
        setSubMenuEl(event.currentTarget);
    };
    const handleSubMenuClose = () => {
        setSubMenuEl(null);
    };

    return (
        <>
        <div
        className='hover:bg-zinc-300 px-2 cursor-pointer ml-2 z-50'
        aria-controls={openMainMenu ? 'main-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMainMenu ? 'true' : undefined}
        onClick={handleMainMenu}>
            <span className="uppercase">{category}</span>
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
                onClick={() => navigate(`${category}/season`)}>
                    <span className="uppercase text-sm">
                        Season
                    </span>
                </div>
                <div 
                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300 cursor-pointer" 
                onClick={() => navigate(`${category}`)}>
                    <span className="uppercase text-sm">
                        All
                    </span>
                </div>
                {categoryData.map(subcategory => (
                <div key={subcategory.id}>
                    <div   
                    className='hover:bg-zinc-300 cursor-pointer p-2 border-b-2 border-zinc-400'
                    aria-controls={openSubMenu ? subcategory.name : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu ? 'true' : undefined}
                    onClick={(event) => handleSubMenu(event, subcategory.name)}>
                        <span className="uppercase text-sm">
                            {subcategory.name}
                        </span>
                    </div>
                    <Menu
                    PaperProps={{ sx: { borderRadius: 0 } }}
                    MenuListProps={{ sx: { py: 0 } }}
                    id={subcategory.name}
                    anchorEl={subMenuEl}
                    open={openSubMenu && subMenuKey === subcategory.name}
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
                            onClick={() => navigate(`${category}/${subcategory.name}`)}>
                                <span className="uppercase text-sm">All</span>
                            </div>
                            {subcategory.types.map((type, index) => (
                                <div 
                                key={index} 
                                className="p-2 border-b-2 border-zinc-400 cursor-pointer hover:bg-zinc-300"
                                onClick={() => navigate(`${category}/${subcategory.name}/${type}`)}>
                                    <span className="uppercase text-sm">{type}</span>
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