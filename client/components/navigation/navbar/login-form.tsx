import { FormEvent, useState } from 'react';
import FailurePrompt from '@/components/navigation/navbar/failure-prompt';
import { useUser } from '@/contexts/user';
import { BannerImage } from '@/components/ui/banner-image';
import SuccessPrompt from './success-prompt';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export default function LoginForm() {
    const { userLogin } = useUser();
    const [keepAlive, setKeepAlive] = useState<boolean>(false);
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let formData: LoginFormData = {
            "email": form.email.value,
            "password": form.password.value,
            "keepAlive": keepAlive
        }
        await userLogin(formData) ? setSuccessPrompt(true) : setFailurePrompt(true);
    };

    return (
        <>
           <div className='text-zinc-700'>
                <div 
                className='text-xl font-bold text-center pt-5 uppercase'>
                    Welcome Back!
                </div>
                <form className='w-full p-5 pt-0' method='post' onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                required
                                type="email"
                                name="email"
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                required
                                name="password"
                                type="password"
                            />
                        </div>
                        <div className='self-center'>
                            <span 
                            className='text-sm uppercase'>
                                Stay Logged In?
                            </span>
                            <Switch name="keepAlive" onCheckedChange={() => setKeepAlive(!keepAlive)}  />
                        </div>
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <SheetClose asChild>
                            <Button 
                            variant='outline'
                            type="submit">
                                Log In
                            </Button>
                        </SheetClose>
                    </div>
                </form>
                <FailurePrompt active={failurePrompt} />
                <SuccessPrompt active={successPrompt} />
                <Separator />
                <div className='p-5 flex items-center justify-center'>
                    <BannerImage type='sidebar' />
                </div>
            </div>
        </>
    )
}