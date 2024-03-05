import { useState } from 'react';

import FormAddress from './FormAddress';
import FormPayment from './FormPayment';
import {useUser} from '../../contexts/UserContext';
import CheckoutList from './CheckoutList';

export default function Checkout() {
    const { user } = useUser();
    const [addressPassed, setAddressPassed] = useState(false);
    const handleCanProceed = (check) => {
        setAddressPassed(check)
    }

    let cart = localStorage.getItem('oura_cart');
    if(cart == null){
      cart = [];
    } else{
      cart = JSON.parse(cart);
    }

    return (
        (user ?
            cart.length > 0 ?
            <div className='flex flex-col m-auto text-center items-center mt-5 md:mt-10'>
                {addressPassed ? 
                <FormPayment />
                :  
                <FormAddress canProceed={handleCanProceed} />}
            </div>
            : <CheckoutList />
        : 
        <div className='flex flex-col items-center gap-2 m-auto mt-5 md:mt-10'>
            <span className='uppercase'>You must be logged in to proceed with the purchase.</span>
        </div>)
    )
}