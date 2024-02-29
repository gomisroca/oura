import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { useForm } from "react-hook-form";
import * as React from 'react';
import axios from 'axios';
import DummyPic from '../../../assets/dummy.png';
import { Link } from "react-router-dom";

export default function Account() {
    // Menu Handling
    const [menuEl, setMenuEl] = React.useState(null);
    const openMenu = Boolean(menuEl);
    const handleMenu = (event) => {
        setMenuEl(event.currentTarget);
        setRegister(false);
        setLogin(false);
    };
    const handleMenuClose = () => {
        setMenuEl(null);
        setRegister(false);
        setLogin(false);
    };
    const handleMenuRedirect = () => {
        setMenuEl(null);
        setRegister(false);
        setLogin(false);
    };

    //User Handling
    const [user, setUser] = React.useState(null);
    const [userLogin, setLogin] = React.useState(false);
    const [userRegister, setRegister] = React.useState(false);

    const toggleLogin = () => {
        setMenuEl(null);
        setRegister(false);
        setLogin(!userLogin);
    }

    const toggleRegister = () =>{
        setMenuEl(null);
        setLogin(false);
        setRegister(!userRegister);
    }

    //Form Handling
    const {
        register,
        formState: { errors },
        handleSubmit,
      } = useForm({
        mode: "onBlur",
      });
    
      const {
        register: register2,
        formState: { errors: errors2 },
        handleSubmit: handleSubmit2,
      } = useForm({
        mode: "onBlur",
      });

    const onLoginSubmit = data => {
        toggleLogin();
        axios.post(`http://localhost:4030/user/login`, data).then((res) => {
            console.log(res.data)
            if(data.keepAlive == true) {
                localStorage.setItem('oura_session', res.data.token);
            }
            setUser(res.data);
        })
    };

    const onRegisterSubmit = data => {
        toggleRegister();
        axios.post(`http://localhost:4030/user/register`, data).then((res) => {
            console.log(res.data)
            setUser(res.data);
        })
    };

    return (
        <>
            {user?
                <div
                    className='hover:bg-black/10 hover:text-black/80 p-2 cursor-pointer ml-2'
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
                    className='hover:stroke-black/20 ml-2'
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
                <div>
                    <span className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-black/10' onClick={handleMenuRedirect}>Account</span>
                    <hr/>
                    <span className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-black/10' onClick={handleMenuRedirect}>Orders</span>
                    <hr/>
                    <span className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-black/10' onClick={handleMenuRedirect}>Logout</span>
                </div>
                : 
                <div>
                    <span className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-black/10' onClick={toggleLogin}>Login</span>
                    <hr/>
                    <span className='px-5 py-2 uppercase w-full block text-center cursor-pointer hover:bg-black/10' onClick={toggleRegister}>Register</span>
                </div>
                }
            </Menu>
            <Drawer
            anchor='right'
            open={userLogin}
            onClose={toggleLogin}
            sx={{zIndex: 9999}}
            >
                <div className='w-[300px]'>
                    <div className='text-xl font-bold text-center pt-5 uppercase'>Welcome Back</div>
                    <form className='p-5 pt-0' onSubmit={handleSubmit(onLoginSubmit)}>
                        <div className='p-5 flex flex-col'>
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                type="email" 
                                label="E-Mail"
                                {...register("email", { required: true })} 
                            />
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                {...register("password", { required: true })}
                                label="Password"
                            />
                            <div className='self-center'>
                                <span className='text-sm uppercase'>Keep Session Alive?</span>
                                <Switch {...register("keepAlive")}  />
                            </div>
                        </div>
                        <div className='grid w-[200px] m-auto'>
                            <input 
                            value="Log In"
                            className='uppercase cursor-pointer font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' 
                            type="submit" />
                        </div>
                    </form>
                    <hr/>
                    <div className='flex flex-col p-5'>
                        <span 
                        onClick={toggleRegister}
                        className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' 
                        >Not A Member?</span>
                    </div>
                    <hr/>
                    <div className='p-5 h-[500px] flex'>
                        <Link to="/membership">
                            <img 
                            src={DummyPic} 
                            className="h-full self-center"
                            />
                        </Link>
                    </div>
                </div>
            </Drawer>
            <Drawer
            anchor='right'
            open={userRegister}
            onClose={toggleRegister}
            sx={{zIndex: 9999}}
            >
                <div className='w-[300px]'>
                    <div className='text-xl font-bold text-center pt-5 uppercase'>Welcome</div>
                    <form className='p-5 pt-0' onSubmit={handleSubmit2(onRegisterSubmit)}>
                        <div className='p-5 justify-items-center grid'>
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                {...register2("first_name", { required: true, pattern: /^[A-Za-z]+$/i, maxLength: 20 })}
                                label="First Name"
                            />
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                {...register2("last_name", { required: true, pattern: /^[A-Za-z]+$/i,  maxLength: 20 })} 
                                label="Last Name"
                            />
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                type="email" 
                                label="E-Mail"
                                {...register2("email", { required: true })} 
                            />
                            <TextField
                                sx={{margin: '8px'}}
                                required
                                label="Password"
                                {...register2("password", { required: true })} 
                            />
                        </div>
                        <div className='grid w-[200px] m-auto'>
                            <input 
                            value="Register"
                            className='cursor-pointer uppercase font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' 
                            type="submit" />
                        </div>
                    </form>
                    <hr/>
                    <div className='flex flex-col p-5'>
                        <span 
                        onClick={toggleLogin}
                        className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' 
                        >Already A Member?</span>
                    </div>
                    <hr/>
                    <div className='p-5 h-[500px] flex'>
                        <Link to="/membership">
                            <img 
                            src={DummyPic} 
                            className="h-full self-center"
                            />
                        </Link>
                    </div>
                </div>
            </Drawer>
        </>
    )
}