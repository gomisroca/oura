import axios from 'axios';
import { FormEvent, useState } from 'react';
import { useUser } from '../../../contexts/UserContext';

interface Props {
    onSettingsToggle: () => void;
}

interface FormData {
    first_name: string,
    last_name: string,
    email: string,
    old_password?: string,
    new_password?: string,
}

export default function UserSettings({ onSettingsToggle }: Props) {
    const { user, updateToken } = useUser();
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [first_name, setFirstName] = useState<string | undefined>(user?.first_name);
    const [last_name, setLastName] = useState<string | undefined>(user?.last_name);
    const [email, setEmail] = useState<string | undefined>(user?.email);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let data: FormData = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            email: form.email.value
        }
        if(form.old_password.value && form.new_password.value){
            data.old_password = form.old_password.value;
            data.new_password = form.new_password.value;
        }

        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/update`, data).then(res => {
            if(res.status === 200){
                setSuccessPrompt(true);
                updateToken(res.data)
                setTimeout(() => { onSettingsToggle() }, 5000);
            }
        });
    }

    return (
        <>
        <div className='w-[300px] text-zinc-700 flex flex-col mt-10 items-center'>
            <span className='uppercase'>Account Details</span>
            <form
            method='post' 
            onSubmit={handleSubmit} 
            className="flex-col grid gap-y-4 p-4">
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        First Name
                    </label>
                    <input 
                    name="first_name" 
                    type="text"
                    value={first_name}
                    onChange={(e) => { setFirstName(e.target.value) }}
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Last Name
                    </label>
                    <input 
                    name="last_name" 
                    type="text"
                    value={last_name}
                    onChange={(e) => { setLastName(e.target.value) }}
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        E-Mail
                    </label>
                    <input 
                    name="email" 
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Old Password
                    </label>
                    <input 
                    name="old_password" 
                    type="password"
                    placeholder='*******'
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        New Password
                    </label>
                    <input 
                    name="new_password" 
                    type="password"
                    placeholder='*******'
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className='grid w-[200px] m-auto'>
                    <input 
                    value="Update"
                    className='uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                    type="submit" />
                </div>
            </form>
            {successPrompt &&
                <div>Your information was updated.</div>
            }
        </div>
        </>
    )
}