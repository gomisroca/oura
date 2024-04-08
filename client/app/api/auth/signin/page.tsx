import { FormEvent, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { useUser } from 'app/contexts/UserContext';
import FailurePrompt from '../FailurePrompt';
import { redirect, useRouter } from 'next/navigation';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getCsrfToken } from 'next-auth/react';

export default function SignIn({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { push } = useRouter();
    const { userLogin } = useUser();
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    const [settings, setSettings] = useState<SidebarSettings>();
    

    const fetchSidebarSettings = async() => {
        await axios.get<SidebarSettings>(`${process.env.API_URL}/settings/sidebar`)
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
           <div className='text-zinc-700'>
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
                    onClick={() => push('/auth/new-user')}
                    className='my-2 w-[200px] uppercase m-auto text-center cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                    >
                        Not A Member?
                    </span>
                </div>
                <hr/>
                <div className='p-5 flex max-w-[300px] items-center justify-center'>
                    <img 
                    src={settings?.image ? settings.image: '/images/ph_hbanner.png'} 
                    className="max-h-[500px]"
                    />
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
      },
    }
}