import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";
import { MenuList } from '@mui/material';
import CheckoutConfirmation from './CheckoutConfirmation';

export default function CheckoutList(props) {
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
        <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-black/20 mt-5 md:mt-16'>
            {check ? 
                <CheckoutConfirmation />
                :
                <MenuList
                    id="cart-menu"
                >
                    {cart[0] == null ? <MenuItem className='cursor-default'><ListItemText className='cursor-default'>Nothing in your cart yet</ListItemText></MenuItem> : ''}
                    {cart.map((item) => (
                    <div
                    className='flex flex-row text-start items-center'
                    key={item.cartID}>
                        <Link 
                        className='p-2 w-full border-b-2 flex flex-row hover:bg-black/10 items-center'
                        to={ '/' + item.categories[0] + '/' + item.type + '/' + item.id }
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
                            <ListItemText className='text-justify self-center px-5'>
                                <span>{item.title}</span>
                                <br />
                                <span className='text-black/60'>{item.sale ? item.sale : item.price}€</span>
                            </ListItemText>
                        </Link>
                    </div>
                    ))}
                    <div className='border-t-2 border-black/30 flex justify-end p-3 items-center cursor-default'>
                        <span className='mx-5 text-sm'>TOTAL <span className='text-lg'>{totalCartPrice}€</span></span>
                    </div>
                </MenuList>
            }
        </div>
    )
}