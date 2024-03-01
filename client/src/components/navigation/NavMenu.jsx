import React from "react";
import UserMenu from "./UserMenu/index";
import Menu from '@mui/material/Menu';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function NavMenu() {
    const navigate = useNavigate();
    const [menuEl, setMenuEl] = React.useState(null);
    const openMenu = Boolean(menuEl);
    const handleMenu = (event) => {
        setMenuEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuEl(null);
    };

    const [menuEl2, setMenuEl2] = React.useState(null);
    const openMenu2 = Boolean(menuEl2);
    const handleMenu2 = (event) => {
        setMenuEl2(event.currentTarget);
    };
    const handleMenuClose2 = () => {
        setMenuEl2(null);
    };

    const [maleMenuEl, setMaleMenuEl] = React.useState(null);
    const [maleMenuKey, setMaleMenuKey] = React.useState(null);
    const openMaleMenu = Boolean(maleMenuEl);
    const handleMaleMenu = (event, key) => {
        setMaleMenuKey(key)
        setMaleMenuEl(event.currentTarget);
    };
    const handleMaleMenuClose = () => {
        setMaleMenuEl(null);
    };

    const [femaleMenuEl, setFemaleMenuEl] = React.useState(null);
    const [femaleMenuKey, setFemaleMenuKey] = React.useState(null);
    const openFemaleMenu = Boolean(femaleMenuEl);
    const handleFemaleMenu = (event, key) => {
        setFemaleMenuKey(key)
        setFemaleMenuEl(event.currentTarget);
    };
    const handleFemaleMenuClose = () => {
        setFemaleMenuEl(null);
    };

    const [man, setMan] = React.useState([]);
    const [woman, setWoman] = React.useState([]);
    React.useEffect(() => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/catalog`)
        .then((res) => {
        let manFilter = (res.data).find(x => x.genre == 'man');
        let manArray = manFilter.classes;
        setMan(manArray);
        
        let womanFilter = (res.data).find(x => x.genre == 'woman');
        let womanArray = womanFilter.classes;
        setWoman(womanArray);
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
        <div id="sidebar" className="flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow">
            <div 
            className="px-2 font-semibold subpixel-antialiased text-[1.2rem] hover:text-zinc-800" 
            onClick={() => navigate('')}>
                OURA
            </div>
            <nav className="my-auto">
                <ul className="flex flex-row">
                    <div
                    className='hover:bg-zinc-300 px-2 cursor-pointer ml-2'
                    aria-controls={openMenu ? 'male-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleMenu}
                    >
                    MEN
                    </div>
                    <Menu
                    PaperProps={{ sx: { borderRadius: 0 } }}
                    MenuListProps={{ sx: { py: 0 } }}
                    id="male-menu"
                    anchorEl={menuEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    >
                    <div className="flex flex-col">
                            <div 
                            className="p-2 border-b-2 border-green-500/20 bg-green-200 hover:bg-green-300" 
                            onClick={() => navigate('man/season')}>
                                <span className="uppercase text-sm">
                                    Season
                                </span>
                            </div>
                            <div 
                            className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300" 
                            onClick={() => navigate('man')}>
                                <span className="uppercase text-sm">All</span>
                            </div>
                    {man.map((key) => {
                        return(
                        <div key={key.id}>
                            <div   
                            className='hover:bg-zinc-300 cursor-pointer p-2 border-b-2 border-zinc-400'
                            aria-controls={openMaleMenu ? key.name : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMaleMenu ? 'true' : undefined}
                            onClick={(event) => handleMaleMenu(event, key.name)}
                            >
                            <span className="uppercase text-sm">{key.name}</span>
                            </div>
                            <Menu
                            PaperProps={{ sx: { borderRadius: 0 } }}
                            MenuListProps={{ sx: { py: 0 } }}
                            id={key.name}
                            anchorEl={maleMenuEl}
                            open={openMaleMenu && maleMenuKey === key.name}
                            onClose={handleMaleMenuClose}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'center',
                                horizontal: 'left',
                            }}
                            >
                            <div className="flex flex-col">
                                <div 
                                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300"
                                onClick={() => navigate('man/' + key['name'])}>
                                    <span className="uppercase text-sm">All</span>
                                </div>
                                {key.types.map((type, index) => (
                                <div 
                                key={index} 
                                className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300"
                                onClick={() => navigate('man/' + key['name'] + '/' + type)}>
                                    <span className="uppercase text-sm">{type}</span>
                                </div>
                                ))}
                            </div>
                            </Menu>
                        </div>
                        )
                    })}
                    </div>
                    </Menu>
                    <hr />
                    <div
                    className='hover:bg-zinc-300 px-2 cursor-pointer ml-2'
                    aria-controls={openMenu2 ? 'female-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu2 ? 'true' : undefined}
                    onClick={handleMenu2}
                    >
                    WOMEN
                    </div>
                    <Menu
                    PaperProps={{ sx: {borderRadius: 0} }}
                    MenuListProps={{ sx: { py: 0 } }}
                    id="female-menu"
                    anchorEl={menuEl2}
                    open={openMenu2}
                    onClose={handleMenuClose2}
                    >
                        <div className="flex flex-col">
                            <div 
                            className="p-2 border-b-2 border-green-500/20 bg-green-200 hover:bg-green-300" 
                            onClick={() => navigate('woman/season')}>
                                <span className="uppercase text-sm">Season</span>
                            </div>
                            <div className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300" onClick={() => navigate('woman')}>
                                <span className="uppercase text-sm">All</span>
                            </div>
                            {woman.map((key) => {
                            return(
                            <div key={key.id}>
                                <div   
                                className='hover:bg-zinc-300 cursor-pointer p-2 border-b-2 border-zinc-400'
                                aria-controls={openFemaleMenu ? key.name : undefined}
                                aria-haspopup="true"
                                aria-expanded={openFemaleMenu ? 'true' : undefined}
                                onClick={(event) => handleFemaleMenu(event, key.name)}
                                >
                                    <span className="uppercase text-sm">{key.name}</span>
                                </div>
                                <Menu
                                PaperProps={{ sx: {borderRadius: 0} }}
                                MenuListProps={{ sx: { py: 0 } }}
                                id={key.name}
                                anchorEl={femaleMenuEl}
                                open={openFemaleMenu && femaleMenuKey === key.name}
                                onClose={handleFemaleMenuClose}
                                anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'center',
                                    horizontal: 'left',
                                }}
                                >
                                <div className="flex flex-col">
                                    <div 
                                    className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300" 
                                    onClick={() => navigate('woman/' + key['name'])}>
                                        <span className="uppercase text-sm">All</span>
                                    </div>
                                    {key.types.map((type, index) => (
                                    <div 
                                    key={index} 
                                    className="p-2 border-b-2 border-zinc-400 hover:bg-zinc-300" 
                                    onClick={() => navigate('woman/' + key['name'] + '/' + type)}>
                                        <span className="uppercase text-sm">{type}</span>
                                    </div>
                                    ))}
                                </div>
                                </Menu>
                            </div>
                            )
                            })}
                        </div>
                    </Menu>
                </ul>
            </nav>
            <div className="absolute right-0 self-center">
                <UserMenu />
            </div>
        </div>
        </>
    );
}