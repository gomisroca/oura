import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function UserEdit() {
    const navigate = useNavigate();
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        navigate('/')
    }
    
    const id = useParams().id;
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [userInfo, setUser] = useState<User>();
    const [firstName, setFirstName] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [role, setRole] = useState<string>('BASIC');
    const [passCheck, setPassCheck] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string | undefined>();

    useEffect(() => {
        axios.get<User>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${id}`)
        .then(res => {
            setUser(res.data);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
            setEmail(res.data.email);
            setRole(res.data.role);
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
    }, [id])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        let formData: {
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            new_password?: string;
        } = {
            firstName: firstName!,
            lastName: lastName!,
            email: email!,
            role: role!,
        }
        if(passCheck && newPassword){
            formData.new_password = newPassword;
        }
        console.log(formData)

        await axios.post<void>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${userInfo?.id}` , formData).then(res => {
            if(res.status === 200){
                setSuccessPrompt(true);
            }
        });
    }
    
    return (
        <div className="w-1/2 flex flex-col  mt-10 text-zinc-700 bg-zinc-200">
            {successPrompt ?
            <div className='font-semibold text-center mt-2 mb-4'>User {userInfo?.firstName} {userInfo?.lastName} was updated.</div>
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
                    value={firstName || ''}
                    onChange={(e) => { setFirstName(e.target.value) }}
                    name="firstName" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Last Name
                    </label>
                    <input
                    value={lastName || ''}
                    onChange={(e) => { setLastName(e.target.value) }}
                    name="lastName" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        Email
                    </label>
                    <input
                    value={email || ''}
                    onChange={(e) => { setEmail(e.target.value) }}
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
                    value={role}
                    onChange={(e) => { setRole(e.target.value)}}
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
                {passCheck &&
                <div className="flex flex-col">
                    <label className="uppercase font-bold mb-2">
                        New Password
                    </label>
                    <input
                    onChange={(e) => { setNewPassword(e.target.value) }}
                    name="newPassword" 
                    type="text"
                    className="transition duration-200 p-2 bg-zinc-200 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-zinc-500" /> 
                </div>}
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
