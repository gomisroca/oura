
import * as React from 'react';
import CheckoutList from './CheckoutList';

export default function CheckoutConfirmation() {

    return (
        <div className='flex flex-col overflow-hidden text-zinc-700 m-5 p-5'>
            <div className='flex flex-col text-center'>
                <span className='text-lg uppercase'>Thank you for your order</span>
                <span>You should receive an email with details about your order soon.</span>
            </div>
            <CheckoutList />
        </div>
    )
}