import * as React from 'react';
import CheckoutConfirmation from './CheckoutConfirmation';
import FormAddress from './FormAddress';
import FormPayment from './FormPayment';

export default function Checkout() {

    const [check, setCheck] = React.useState(false);
    const proceed = (check) => {
        setCheck(check)
    }


    return (
        check ? 
        <FormPayment />
        :  
        <FormAddress func={proceed} />
    )
}