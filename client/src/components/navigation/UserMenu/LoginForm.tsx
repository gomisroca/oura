import { FormEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { useUser } from '../../../contexts/UserContext';
import HorizontalBannerPlaceholder from '../../../assets/ph_hbanner.png';
import FailurePrompt from './FailurePrompt';

interface Props {
    onLoginToggle: () => void;
    onRegisterToggle: () => void;
}

export default function LoginForm({ onLoginToggle, onRegisterToggle }: Props) {
    const { userLogin } = useUser();
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let formData: LoginFormData = {
            "email": form.email.value,
            "password": form.password.value,
            "keepAlive": form.keepAlive.checked
        }
        
        await userLogin(formData) ? onLoginToggle() : setFailurePrompt(true);
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
                <FailurePrompt active={failurePrompt} />
                <hr/>
                <div className='flex flex-col p-5'>
                    <span 
                    onClick={onRegisterToggle}
                    className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                    >
                        Not A Member?
                    </span>
                </div>
                <hr/>
                <div className='p-5 flex max-w-[300px] items-center justify-center'>
                    <img 
                    src={HorizontalBannerPlaceholder} 
                    className="max-h-[500px]"
                    />
                </div>
            </div>
        </>
    )
}