import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { MenuList } from '@mui/material';
import CheckoutConfirmation from './CheckoutConfirmation';

export default function CheckoutList(props) {
    const navigate = useNavigate();
    let check = props.check;

    let cart = localStorage.getItem('oura_cart');
    if(cart == null){
      cart = [];
    } else{
      cart = JSON.parse(cart);
    }
    let totalCartPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        if(cart[i].sale){
            totalCartPrice = totalCartPrice + cart[i].sale
        } else{
            totalCartPrice = totalCartPrice + cart[i].price
        }
    }
    totalCartPrice = Math.floor(totalCartPrice * 100) / 100;

    return (
        <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700 mt-5 md:mt-16'>
            {check ? 
                <CheckoutConfirmation />
                :
                <MenuList id="cart-menu">
                    {cart[0] == null ? 
                        <div 
                        className='p-2 flex justify-center'>
                            There is nothing in your cart yet.
                        </div>
                    : 
                    <div>
                        {cart.map((item) => (
                        <div
                        className='flex flex-row text-start items-center'
                        key={item.cartID}>
                            <div 
                            className='p-2 w-full border-b-2 flex flex-row hover:bg-zinc-200 items-center'
                            onClick={() => navigate('/' + item.categories[0] + '/' + item.type + '/' + item.id)}
                            >
                                <div className='w-[50px]'>
                                    <img
                                    className='max-w-[50px] max-h-[50px]'
                                    src={`${item.image}`}
                                    srcSet={`${item.image}`}
                                    alt={item.title}
                                    loading="lazy"
                                    />
                                </div>
                                <div className='text-justify self-center px-5'>
                                    <span>{item.title}</span>
                                    <br />
                                    <span className='text-zinc-800'>{item.sale ? item.sale : item.price}€</span>
                                </div>
                            </div>
                        </div>
                        ))}
                        <div className='border-t-2 border-zinc-400 flex justify-end p-3 items-center cursor-default'>
                            <span className='mx-5 text-sm'>TOTAL <span className='text-lg'>{totalCartPrice}€</span></span>
                        </div>
                    </div>
                    }
                </MenuList>
            }
        </div>
    )
}