import * as React from 'react';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';

import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserSettings from './UserSettings';

export default function Account() {
    const { push } = useRouter();
    const { user, userLogout } = useUser();

    // Menu Handling
    const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(menuEl);
    const handleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        setMenuEl(event.currentTarget);
        setRegisterDrawer(false);
        setLoginDrawer(false);
    };
    const handleMenuClose = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setLoginDrawer(false);
        setSettingsDrawer(false);
    };
    const handleMenuRedirect = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setLoginDrawer(false);
        setSettingsDrawer(false);
    };

    //Drawer Handling
    const [loginDrawer, setLoginDrawer] = React.useState<boolean>(false);
    const [registerDrawer, setRegisterDrawer] = React.useState<boolean>(false);
    const [settingsDrawer, setSettingsDrawer] = React.useState<boolean>(false);

    const handleLoginToggle = () => {
        setMenuEl(null);
        setRegisterDrawer(false);
        setSettingsDrawer(false);
        setLoginDrawer(!loginDrawer);
    }

    const handleRegisterToggle = () =>{
        setMenuEl(null);
        setLoginDrawer(false);
        setSettingsDrawer(false);
        setRegisterDrawer(!registerDrawer);
    }

    const handleSettingsToggle = () => {
        setMenuEl(null);
        setLoginDrawer(false);
        setRegisterDrawer(false);
        setSettingsDrawer(!settingsDrawer);
    }

    return (
        <>
            {user ?
                <div
                    className='hover:zinc-300 text-zinc-700 hover:text-zinc-800 text-[0.9rem]  md:text-[1rem] md:px-2 cursor-pointer ml-2'
                    id="user-button"
                    aria-controls={openMenu ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleMenu}
                    aria-label={`User Menu`}
                >
                    {user.firstName.toUpperCase()}
                </div>
            :   
                <div
                aria-controls={openMenu ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined}
                onClick={handleMenu}
                aria-label={`User Menu`}>
                    <IconButton
                    className='hover:stroke-zinc-400 ml-2'
                    id="user-button"
                    >
                        <MenuIcon />
                    </IconButton>
                </div>
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
                    onClick={handleSettingsToggle}>
                        Settings
                    </span>
                    <hr/>
                    <span 
                    className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-zinc-300' 
                    onClick={() => push(`/order-history`)}>
                        Your Orders
                    </span>
                    <hr/>
                    {user.role !== 'BASIC' ?
                    <div>
                        <hr/>
                        <span 
                        className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-violet-300' 
                        onClick={() => push(`/editor`)}>
                            🔒 Dashboard
                        </span>
                        <hr/>
                    </div>
                    : null}
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
                <LoginForm onLoginToggle={handleLoginToggle} onRegisterToggle={handleRegisterToggle} />
            </Drawer>
            <Drawer
            anchor='right'
            open={registerDrawer}
            onClose={handleRegisterToggle}
            sx={{zIndex: 9999}}
            >
                <RegisterForm onLoginToggle={handleLoginToggle} onRegisterToggle={handleRegisterToggle} />
            </Drawer>
            <Drawer
            anchor='right'
            open={settingsDrawer}
            onClose={handleSettingsToggle}
            sx={{zIndex: 9999}}
            >
                <UserSettings onSettingsToggle={handleSettingsToggle} />
            </Drawer>
        </>
    )
}