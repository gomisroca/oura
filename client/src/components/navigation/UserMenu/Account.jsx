import * as React from 'react';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useUser } from '../../../contexts/UserContext';

export default function Account() {
    const { user, userLogout } = useUser();

    // Menu Handling
    const [menuEl, setMenuEl] = React.useState(null);
    const openMenu = Boolean(menuEl);
    const handleMenu = (event) => {
        setMenuEl(event.currentTarget);
        setRegisterDrawer(false);
        setLoginDrawer(false);
    };
    const handleMenuClose = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setLoginDrawer(false);
    };
    const handleMenuRedirect = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setLoginDrawer(false);
    };

    //Drawer Handling
    const [loginDrawer, setLoginDrawer] = React.useState(false);
    const [registerDrawer, setRegisterDrawer] = React.useState(false);

    const handleLoginToggle = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setLoginDrawer(!loginDrawer);
    }

    const handleRegisterToggle = () =>{
        setMenuEl(null);
        setLoginDrawer(false);
        setRegisterDrawer(!registerDrawer);
    }

    return (
        <>
            {user ?
                <div
                    className='hover:zinc-300 text-zinc-700 hover:text-zinc-800 px-2 cursor-pointer ml-2'
                    id="user-button"
                    aria-controls={openMenu ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleMenu}
                    aria-label={`User Menu`}
                >
                    {user.first_name.toUpperCase()}
                </div>
            :
                <IconButton
                    className='hover:stroke-zinc-400 ml-2'
                    id="user-button"
                    aria-controls={openMenu ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleMenu}
                    aria-label={`User Menu`}
                >
                    <MenuIcon />
                </IconButton>
            }
            <Menu
                id="user-menu"
                anchorEl={menuEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                'aria-labelledby': 'user-button',
                 sx: { py: 0 },
                }}
                PaperProps={{
                sx: { borderRadius: 0 }
                }}
            >
                {user ? 
                <div className='text-zinc-700'>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-zinc-300' 
                    onClick={handleMenuRedirect}>
                        Account
                    </span>
                    <hr/>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-zinc-300' 
                    onClick={handleMenuRedirect}>
                        Orders
                    </span>
                    <hr/>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-red-500' 
                    onClick={() => { userLogout(); handleMenuClose(); }}>
                        Logout
                    </span>
                </div>
                : 
                <div className='text-zinc-700'>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-zinc-300' 
                    onClick={handleLoginToggle}>
                        Login
                    </span>
                    <hr/>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-zinc-300' 
                    onClick={handleRegisterToggle}>
                        Register
                    </span>
                </div>
                }
            </Menu>
            <Drawer
            anchor='right'
            open={loginDrawer}
            onClose={handleLoginToggle}
            sx={{zIndex: 9999}}
            >
                <LoginForm loginToggle={handleLoginToggle} registerToggle={handleRegisterToggle} />
            </Drawer>
            <Drawer
            anchor='right'
            open={registerDrawer}
            onClose={handleRegisterToggle}
            sx={{zIndex: 9999}}
            >
                <RegisterForm loginToggle={handleLoginToggle} registerToggle={handleRegisterToggle} />
            </Drawer>
        </>
    )
}