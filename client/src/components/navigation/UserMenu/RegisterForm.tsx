import TextField from "@mui/material/TextField";
import { FormEvent, useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import HorizontalBannerPlaceholder from "../../../assets/ph_hbanner.png";
import FailurePrompt from "./FailurePrompt";
import axios from "axios";

interface Props {
    onLoginToggle: () => void;
    onRegisterToggle: () => void;
}


export default function RegisterForm({ onLoginToggle, onRegisterToggle }: Props) {
    const { userRegister } = useContext(UserContext);
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<SidebarSettings>();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let formData: RegisterFormData = {
            "firstName": form.firstName.value,
            "lastName": form.lastName.value,
            "email": form.email.value,
            "password": form.password.value,
        }

        await userRegister(formData) ? onRegisterToggle() : setFailurePrompt(true);
    };

    const fetchSidebarSettings = async() => {
        await axios.get<SidebarSettings>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/sidebar`)
        .then((res) => {
            setSettings(res.data);
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
    }

    useEffect(() => {
        fetchSidebarSettings();
    }, []);
    
    return (
        <>
           <div className="w-[300px] text-zinc-700">
                <div 
                className="text-xl font-bold text-center pt-5 uppercase">
                    Welcome!
                </div>
                <form className="p-5 pt-0" method="post" onSubmit={handleSubmit}>
                    <div className="p-5 flex flex-col">
                        <TextField
                            sx={{margin: "8px"}}
                            required
                            label="First Name"
                            name="firstName"
                            type="text"
                        />
                        <TextField
                            sx={{margin: "8px"}}
                            required
                            label="Last Name"
                            name="lastName"
                            type="text"
                        />
                        <TextField
                            sx={{margin: "8px"}}
                            required
                            type="email"
                            name="email"
                            label="E-Mail"
                        />
                        <TextField
                            sx={{margin: "8px"}}
                            required
                            label="Password"
                            name="password"
                            type="password"
                        />
                    </div>
                    <div className="grid w-[200px] m-auto">
                        <input 
                        value="Register"
                        className="uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300" 
                        type="submit" />
                    </div>
                </form>
                <FailurePrompt active={failurePrompt} />
                <hr/>
                <div className="flex flex-col p-5">
                    <span 
                    onClick={onLoginToggle}
                    className="my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300" 
                    >
                        Already A Member?
                    </span>
                </div>
                <hr/>
                <div className='p-5 flex max-w-[300px] items-center justify-center'>
                    <img
                    src={settings?.image ? settings.image: HorizontalBannerPlaceholder} 
                    className="max-h-[500px]"
                    />
                </div>
            </div>
        </>
    )
}