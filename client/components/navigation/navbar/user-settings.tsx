import { BannerImage } from '@/components/ui/banner-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';
import { useUser } from '@/contexts/user';
import { FormEvent, useState } from 'react';
import FailurePrompt from './failure-prompt';
import SuccessPrompt from './success-prompt';
import { AdImage } from '@/components/ui/ad';

interface FormData {
    firstName: string,
    lastName: string,
    email: string,
    old_password?: string,
    new_password?: string,
}

export default function UserSettings() {
    const { user, updateToken } = useUser();
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string | undefined>(user?.firstName);
    const [lastName, setLastName] = useState<string | undefined>(user?.lastName);
    const [email, setEmail] = useState<string | undefined>(user?.email);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let data: FormData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value
        }
        if(form.old_password.value && form.new_password.value){
            data.old_password = form.old_password.value;
            data.new_password = form.new_password.value;
        }
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
                method: 'POST',
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if(res.ok){
                setFailurePrompt(false);
                setSuccessPrompt(true);
                updateToken(await res.json())
            } else{
                setFailurePrompt(true);
                setSuccessPrompt(false);
            }
        } catch(err){
            console.log(err)
        }
    }

    return (
        <>
        <div className='text-zinc-700 flex flex-col mt-10 items-center'>
            <span className='uppercase'>Account Details</span>
            <form className='w-full p-5 pt-0' method='post' onSubmit={handleSubmit}>
                <div className='p-5 flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor='firstName'>
                            First Name
                        </Label>
                        <Input 
                        name="firstName" 
                        type="text"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value) }}
                        /> 
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor='lastName'>
                            Last Name
                        </Label>
                        <Input 
                        name="lastName" 
                        type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value) }}
                        /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor='email'>
                            E-Mail
                        </Label>
                        <Input 
                        name="email" 
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor='old_password'>
                            Old Password
                        </Label>
                        <Input 
                        name="old_password" 
                        type="password"
                        placeholder='*******'
                        /> 
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor='new_password'>
                            New Password
                        </Label>
                        <Input 
                        name="new_password" 
                        type="password"
                        placeholder='*******'
                        /> 
                    </div>
                </div>
                <div className='grid w-[200px] m-auto'>
                    <SheetClose asChild>
                        <Button 
                        variant='outline'
                        type="submit">
                            Update
                        </Button>
                    </SheetClose>
                </div>
            </form>
            <FailurePrompt active={failurePrompt} />
            <SuccessPrompt active={successPrompt} />
            <Separator />
            <div className='p-5 flex items-center justify-center'>
                <AdImage />
            </div>
        </div>
        </>
    )
}