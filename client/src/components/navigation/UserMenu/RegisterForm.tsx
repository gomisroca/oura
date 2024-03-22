import TextField from "@mui/material/TextField";
import { FormEvent, useContext, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import DummyPic from "../../../assets/dummy.png";
import FailurePrompt from "./FailurePrompt";

interface Props {
    onLoginToggle: () => void;
    onRegisterToggle: () => void;
}


export default function RegisterForm({ onLoginToggle, onRegisterToggle }: Props) {
    const { userRegister } = useContext(UserContext);
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);

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
                <div className="p-5 h-[500px] flex">
                    <img 
                    src={DummyPic} 
                    className="h-full self-center"
                    />
                </div>
            </div>
        </>
    )
}