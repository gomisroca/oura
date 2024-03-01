import * as React from 'react';

import TextField from '@mui/material/TextField';

import DummyPic from '../../../assets/dummy.png';

import { useUser } from '../../../contexts/UserContext';

export default function RegisterForm({ loginToggle, registerToggle }) {
    const { userRegister } = useUser();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        console.log(form)

        let formData = new URLSearchParams();
        
        formData.append('first_name', form.first_name.value);
        formData.append('last_name', form.last_name.value);
        formData.append('email', form.email.value);
        formData.append('password', form.password.value);

        let registered = userRegister(formData);
        if (registered) {
            registerToggle();
        } else {
            // toggle a prompt saying something went wrong with the login
        }
    };

    return (
        <>
           <div className='w-[300px] text-zinc-700'>
                <div 
                className='text-xl font-bold text-center pt-5 uppercase'>
                    Welcome!
                </div>
                <form className='p-5 pt-0' method='post' onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col'>
                        <TextField
                            sx={{margin: '8px'}}
                            required
                            label="First Name"
                            name="first_name"
                            type="text"
                        />
                        <TextField
                            sx={{margin: '8px'}}
                            required
                            label="Last Name"
                            name="last_name"
                            type="text"
                        />
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
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <input 
                        value="Register"
                        className='uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        type="submit" />
                    </div>
                </form>
                <hr/>
                <div className='flex flex-col p-5'>
                    <span 
                    onClick={loginToggle}
                    className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                    >
                        Already A Member?
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