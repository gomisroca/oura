import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function UserUpload() {
    const navigate = useNavigate();
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        navigate('/')
    }
    
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [passCheck, setPassCheck] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        let formData: {
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            password: string;
        } = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            role: form.role.value,
            password: form.password.value,
        }
        console.log(formData)

        await axios.post<void>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/register` , formData).then(res => {
            if(res.status === 200){
                setSuccessPrompt(true);
            }
        });
    }
    
    return (
        <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
            {successPrompt ?
            <div className='font-semibold text-center mt-2 mb-4'>User was uploaded.</div>
            :
            <form 
            method="post" 
            onSubmit={handleSubmit} 
            className="flex-col grid gap-y-4 p-4">
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        First Name
                    </label>
                    <input
                    name="firstName" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Last Name
                    </label>
                    <input
                    name="lastName" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Email
                    </label>
                    <input
                    name="email" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Role
                    </label>
                    <select 
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500"
                    name="role"
                    id="role">
                        <option value="BASIC">BASIC</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="SUPER">SUPER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div className="flex flex-row">
                    <label className="uppercase font-bold mr-4">
                        Set New Password? This could critically impact the user.
                    </label>
                    <input 
                    checked={passCheck || false}
                    onChange={(e) => { setPassCheck(e.target.checked) }}
                    type="checkbox" 
                    name="passCheck"
                    className="transition duration-200 p-6 rounded-md cursor-pointer bg-zinc-200 hover:bg-zinc-300 text-zinc-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Password
                    </label>
                    <input
                    name="password" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <button 
                type="submit" 
                className="uppercase font-bold py-4 hover:bg-zinc-300 transition duration-200 w-full m-auto">
                    Update
                </button>
            </form>
            }
        </div>
    )
}
