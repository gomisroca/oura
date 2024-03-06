import * as React from 'react';

import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';

import DummyPic from '../../../assets/dummy.png';

import { useUser } from '../../../contexts/UserContext';

export default function LoginForm({ loginToggle, registerToggle }) {
    const { userLogin } = useUser();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.target;
        let formData = {
            "email": form.email.value,
            "password": form.password.value,
            "keepAlive": form.keepAlive.checked
        }

        let loggedIn = userLogin(formData);
        if (loggedIn) {
            loginToggle();
        } else {
            // toggle a prompt saying something went wrong with the login
        }
    };

    return (
        <>
           <div className='w-[300px] text-zinc-700'>
                <div 
                className='text-xl font-bold text-center pt-5 uppercase'>
                    Welcome Back!
                </div>
                <form className='p-5 pt-0' method='post' onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col'>
                        <TextField
                            sx={{margin: '8px'}}
                            required
                            type="email"
                            name="email"
                            label="E-Mail"
                        />
                        <TextField
                            sx={{margin: '8px'}}
                            required
                            label="Password"
                            name="password"
                            type="password"
                        />
                        <div className='self-center'>
                            <span 
                            className='text-sm uppercase'>
                                Stay Logged In?
                            </span>
                            <Switch name="keepAlive" type="checkbox" />
                        </div>
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <input 
                        value="Log In"
                        className='uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        type="submit" />
                    </div>
                </form>
                <hr/>
                <div className='flex flex-col p-5'>
                    <span 
                    onClick={registerToggle}
                    className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                    >
                        Not A Member?
                    </span>
                </div>
                <hr/>
                <div className='p-5 h-[500px] flex'>
                    <img 
                    src={DummyPic} 
                    className="h-full self-center"
                    />
                </div>
            </div>
        </>
    )
}