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


        axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/update`, cart)
        .then(res => {
            // if we receive an OK...
            
            // TODO
            const access_token = localStorage.getItem('oura_access_token');
            axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/purchase`, data, 
                { headers: { 'Authentication': `Bearer ${access_token}`} }
            )
            .then(res => {
                // if we receive an OK...
                localStorage.removeItem('oura_cart');
                setCheck(true);
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
        
    }

    return (
        <div>
            {check ? 
            <CheckoutList check={check} />
            :
            <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700 mt-5 md:mt-16'>
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
                        <button 
                        className='font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            }
        </div>
    )
}