'use client'

import { useForm } from "react-hook-form";
import CheckoutList from '@/components/shop/checkout-list';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface Props {
    canProceed: (proceed: boolean) => void;
}

export default function FormAddress({ canProceed }: Props) {
    const { register, handleSubmit } = useForm();
    
    const onSubmit = () => {
        canProceed(true)
    };

    return (
        <div>
            <div className='p-2 mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700'>
                <div className='text-sm text-red-600 my-2'>
                    This is a mock website. None of the data filled in these forms is stored or used in any way.
                </div>
                <form className='w-full p-5 pt-0' method='post' onSubmit={handleSubmit(onSubmit)}>
                    <div className='p-5 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="firstName">
                                First Name
                            </Label>
                            <Input
                            required
                            type="text"
                            {...register("firstName", { required: true, pattern: /^[A-Za-z]+$/i, maxLength: 20 })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="lastName">
                            Last Name
                            </Label>
                            <Input
                            required
                            type="text"
                            {...register("lastName", { required: true, pattern: /^[A-Za-z]+$/i,  maxLength: 20 })} 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="email">
                                E-Mail
                            </Label>
                            <Input
                            required
                            type="email"
                            {...register("email", { required: true })} 
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="birthDate">
                                Birth Date
                            </Label>
                            <Input
                            required
                            type="date"
                            {...register("birthDate", { required: true })} 
                            />
                        </div>
                    </div>
                    <div  className='p-5 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="address">
                                Street Address
                            </Label>
                            <Input
                            required
                            type="text"
                            {...register("address", { required: true })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="zipCode">
                                ZIP Code
                            </Label>
                            <Input
                            required
                            placeholder='00000'
                            {...register("zipCode", { required: true })}
                            type="number"
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="province">
                                Province
                            </Label>
                            <Input
                            type="text"
                            {...register("province")}
                            />
                            </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="country">
                                Country
                            </Label>
                            <Input
                            required
                            type="text"
                            {...register("country", { required: true })}
                            />
                        </div>
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <Button 
                        variant='outline'
                        type="submit">
                            Log In
                        </Button>
                    </div>
                </form>
            </div>
            <CheckoutList />
        </div>
    )
}