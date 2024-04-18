'use client'

import { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CartContext {
    cart: CartItem[] | undefined,
    addToCart: (item: Product, size?: Size, color?: string) => unknown | void;
    removeFromCart: (id: string) => unknown | void;
}

const CartContext = createContext({} as CartContext);
export default CartContext;

export function CartProvider({ children }: PropsWithChildren<{}>) {
    const [cart, setCart] = useState<CartItem[] | undefined>()
    
    const addToCart = (item: Product, size?: Size, color?: string) => {
        let cart_item: CartItem = {
            cartId: uuidv4(),
            id: item.id,
        }
        if(size && color){
            cart_item.size = size!.size;
            cart_item.color = color;
        }
        let newCart: CartItem[] = [];
        if(cart){
            newCart = cart;
        }
        newCart.push(cart_item)
        console.log(newCart)
        setCart(newCart)
        localStorage.setItem('oura_cart', JSON.stringify(newCart));
    }

    const removeFromCart = (id: string) => {
        if(cart){
            let item = cart.find(x => x.cartId == id);
            if(item){
                let newCart: CartItem[] = cart;
                const index = cart.indexOf(item);
                if (index > -1) {
                    newCart.splice(index, 1);
                }
                console.log(newCart)
                setCart(newCart)
                localStorage.setItem('oura_cart', JSON.stringify(newCart));
            }
        }
    }

    useEffect(()=>{
        const cartInStorage = localStorage.getItem('oura_cart')
        console.log(cartInStorage)
        if(!cart && cartInStorage){
            setCart(JSON.parse(cartInStorage)) 
        }
    }, [])
    return (
        <CartContext.Provider value={({ cart, addToCart, removeFromCart })}>
            {children}
        </CartContext.Provider>
    )
}