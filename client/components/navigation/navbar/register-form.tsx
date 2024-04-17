import { FormEvent, useState } from "react";
import FailurePrompt from "@/components/navigation/navbar/failure-prompt";
import { useUser } from "@/contexts/user";
import SuccessPrompt from "./success-prompt";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { BannerImage } from "@/components/ui/banner-image";
import { AdImage } from "@/components/ui/ad";

export default function RegisterForm() {
    const { userRegister } = useUser();
    const [failurePrompt, setFailurePrompt] = useState<boolean>(false);
    const [successPrompt, setSuccessPrompt] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        let formData: RegisterFormData = {
            "firstName": form.firstName.value,
            "lastName": form.lastName.value,
            "email": form.email.value,
            "password": form.password.value,
        }

        await userRegister(formData) ? setSuccessPrompt(true) : setFailurePrompt(true);
    };

    return (
        <>
           <div className="text-zinc-700">
                <div 
                className="text-xl font-bold text-center pt-5 uppercase">
                    Welcome!
                </div>
                <form className='w-full p-5 pt-0' method='post' onSubmit={handleSubmit}>
                    <div className='p-5 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                required
                                type="text"
                                name="firstName"
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                required
                                type="text"
                                name="lastName"
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="email">E-Mail</Label>
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
                                type="password"
                                name="password"
                            />
                        </div>
                    </div>
                    <div className="grid w-[200px] m-auto">
                        <SheetClose asChild>
                            <Button 
                            variant='outline'
                            type="submit">
                                Register
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