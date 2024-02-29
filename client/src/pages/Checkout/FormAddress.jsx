import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CheckoutList from './CheckoutList';

export default function FormAddress(props) {
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        console.log(data)
        props.func(true)
    };

    return (
        <div>
            <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-black/20 mt-5 md:mt-16'>
                
                <form className='p-5' onSubmit={handleSubmit(onSubmit)}>
                    <div className='p-5 flex flex-row'>
                        <TextField
                            required
                            {...register("firstName", { required: true, pattern: /^[A-Za-z]+$/i, maxLength: 20 })}
                            label="First Name"
                        />
                        <TextField
                            required
                            {...register("lastName", { required: true, pattern: /^[A-Za-z]+$/i,  maxLength: 20 })} 
                            label="Last Name"
                        />
                        <TextField
                            required
                            type="email" 
                            label="E-Mail"
                            {...register("email", { required: true })} 
                        />
                        <TextField
                            required
                            type="date"
                            label="Birth Date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            {...register("birthDate", { required: true })} 
                        />
                    </div>
                    <div className='p-5 flex flex-row'>
                        <TextField
                            required
                            {...register("address", { required: true })}
                            label="Street Address"
                        />
                        <TextField
                            required
                            placeholder='00000'
                            {...register("zipCode", { required: true })}
                            type="number"
                            label="ZIP Code"
                        />
                        <TextField
                            {...register("province")}
                            label="Province"
                        />
                        <TextField
                            required
                            {...register("country", { required: true })}
                            label="Country"
                        />
                    </div>
                    <div className='grid w-[200px] m-auto'>
                        <button className='font-semibold border-2 p-2 border-black/20 hover:border-black/40 rounded hover:bg-gradient-to-br hover:from-white hover:to-gray-300' type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <CheckoutList />
        </div>
    )
}