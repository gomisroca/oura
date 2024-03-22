import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutConfirmation from './CheckoutConfirmation';

export default function FormPayment() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

    const onSubmit = () => {
        let cart: CartProduct[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');    

        axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/products/update`, cart)
        .then(res => {
            if(res.status === 200){
                axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/user/purchase`, cart)
                .then(res => {
                    if(res.status === 200){
                        setOrderConfirmed(true);
                        setTimeout(() => {
                            localStorage.removeItem('oura_cart');
                            navigate('/')
                        }, 10000)
                    }
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
            </>
        )
    }
}