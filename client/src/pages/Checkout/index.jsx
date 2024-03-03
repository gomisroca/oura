import { useState } from 'react';

import FormAddress from './FormAddress';
import FormPayment from './FormPayment';

export default function Checkout() {
    const [addressPassed, setAddressPassed] = useState(false);
    const handleCanProceed = (check) => {
        setAddressPassed(check)
    }

    return (
        addressPassed ? 
        <FormPayment />
        :  
        <FormAddress canProceed={handleCanProceed} />
    )
}