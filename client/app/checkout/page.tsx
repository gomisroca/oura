'use client'

import { useState } from 'react';

import FormAddress from '@/components/shop/form-address';
import FormPayment from '@/components/shop/form-payment';
import CheckoutList from '@/components/shop/checkout-list';
import { useUser } from '@/contexts/user';

export default function Checkout() {
    const { user } = useUser();
    const [addressPassed, setAddressPassed] = useState<boolean>(false);
    const handleCanProceed = (proceed: boolean) => {
        setAddressPassed(proceed)
    }

    let cart: CartItem[] = global?.window?.localStorage?.getItem('oura_cart') ? JSON.parse(localStorage.getItem('oura_cart')!) : [];

    if(user){
        return (
            <>
            {cart.length > 0 ?
            <div className='flex flex-col m-auto text-center items-center mt-5 md:mt-10'>
                {addressPassed ? 
                <FormPayment />
                :  
                <FormAddress canProceed={handleCanProceed} />
                }
            </div>
            : 
            <CheckoutList />
            }
            </>
        )
    } else {
        return(
            <>
            <div className='flex flex-col items-center gap-2 m-auto mt-5 md:mt-10'>
                <span className='uppercase'>You must be logged in to proceed with the purchase.</span>
            </div>
            </>
        )
    }
}