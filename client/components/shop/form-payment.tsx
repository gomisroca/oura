'use client'

import { useForm } from "react-hook-form";
import { useState } from 'react';
import CheckoutConfirmation from '@/components/shop/checkout-confirmation';
import { redirect } from 'next/navigation';
import { Cookies } from 'react-cookie';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function FormPayment() {
    const cookieManager = new Cookies();
    const accessToken = cookieManager.get('oura__access_token__')
    const { register, handleSubmit } = useForm();
    const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

    const onSubmit = async() => {
        let cart: Product[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');    
        if(accessToken){
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/purchase`,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(cart)
            })
            if(res.ok){
                setOrderConfirmed(true);
                setTimeout(() => {
                    localStorage.removeItem('oura_cart');
                    redirect('/')
                }, 10000)
            }
        }
    }

    if(orderConfirmed){
        return(
            <>
            <CheckoutConfirmation />
            </>
        )
    } else {
        return (
            <>
            <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700'>
                <div className='text-sm text-red-600 my-2'>
                    This is a mock website. None of the data filled in these forms is stored or used in any way.
                </div>
                <form className='w-full p-5 pt-0' method='post' onSubmit={handleSubmit(onSubmit)}>
                    <div className='p-5 flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="cardHolder">
                                Card Holder
                            </Label>
                            <Input
                            type="text"
                            required
                            {...register("cardHolder", { required: true })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="cardNumber">
                                Card Number
                            </Label>
                            <Input
                            type="tel"
                            required
                            {...register("cardNumber", { required: true })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="expiryDate">
                                Expiry Date
                            </Label>
                            <Input
                            type="date"
                            required
                            {...register("expiryDate", { required: true })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="cvv">
                                CVV
                            </Label>
                            <Input
                            type="number"
                            required
                            {...register("cvv", { required: true })}
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
            </>
        )
    }
}