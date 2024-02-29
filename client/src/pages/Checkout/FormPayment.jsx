import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CheckoutList from './CheckoutList';
import axios from 'axios';
import { useState } from 'react';

export default function FormPayment(props) {
    const { register, handleSubmit } = useForm();
    const [check, setCheck] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        let cart = localStorage.getItem('oura_cart');
        if(cart == null){
            cart = [];
        } else{
            cart = JSON.parse(cart);
        }

        setCheck(true);

        axios.post('http://localhost:4030/clothes/update', cart).then(() => {
            localStorage.removeItem('oura_cart');
        });
        
    }

    return (
        <div>
            {check ? 
            <CheckoutList check={check} />
            :
            <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-black/30 mt-5 md:mt-16'>
                <form className='p-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='p-5 flex flex-row'>
                        <TextField
                            type="tel"
                            required
                            {...register("cardNumber", { required: true, pattern: /[0-9\s]{13,19}/i})}
                            label="Card Number"
                        />
                        <TextField
                            required
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...register("expiryDate", { required: true })} 
                            label="Expiry Date"
                        />
                        <TextField
                            required
                            type="number" 
                            label="CVV"
                            {...register("cvv", { required: true, pattern: /[0-9\s]{3}/i })} 
                        />
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <button className='font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' type="submit">Submit</button>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}