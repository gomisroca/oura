'use client'

import { useContext, useState } from 'react';
import PH from '@/public/images/ph_cart.png';
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { Menubar, MenubarTrigger, MenubarContent, MenubarItem, MenubarMenu } from '@/components/ui/menubar';
import { Button } from '@/components/ui/button';
import { getProduct } from '@/utils/products';
import CartContext from '@/contexts/cart';
interface CartProduct {
    cartItem: CartItem;
    product: Product;
}

export default function Cart() {
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
    const [totalPrice, setTotalPrice] = useState<null | number>();
    const { cart, removeFromCart } = useContext(CartContext)
    
    const fetchProducts = async () => {
        let cart_products: CartProduct[] = [];
        if(cart){
            for(const cartItem of cart) {
                try {
                    const product = await getProduct(cartItem.id);
                    const cart_product = {
                        cartItem: cartItem,
                        product: product
                    }
                    cart_products.push(cart_product);
                } catch (error: unknown) {
                    console.error(`Failed to fetch product with ID ${cartItem.id}: ${error}`);
                }
            }
            console.log(cart_products)
            setCartProducts(cart_products)
        }

        let totalCartPrice = 0;
        for (let i = 0; i < cart_products.length; i++) {
            totalCartPrice = totalCartPrice + cart_products[i].product.price
        }
        totalCartPrice = Math.floor(totalCartPrice * 100) / 100;
        setTotalPrice(Number(totalCartPrice));
    }

    return (
        <>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger onClick={() => fetchProducts()} className='py-2 drop-shadow-[1px_1px_5px_black] hover:drop-shadow-none h-full md:px-4 hover:bg-zinc-100/30'>
                        <ShoppingCart />
                    </MenubarTrigger>
                    <MenubarContent className='w-[300px]'>
                    {cartProducts.length == 0 ? 
                        <MenubarItem className='cursor-default p-10'>
                            There is nothing in your cart yet.
                        </MenubarItem>
                    :
                        <div className='flex flex-col'>
                        {cartProducts.length > 0 && cartProducts.map((item) => (
                            <div key={item.cartItem.cartId}  className='w-full flex items-center justify-center'>
                                <Link className='w-full' href={'/category/' + item.product.gender[0].toLowerCase()+ '/' + item.product.category[0].toLowerCase() + '/' + item.product.subcategory[0].toLowerCase() + '/' + item.product.id}>
                                    <MenubarItem className='w-full flex justify-between'>
                                        {item.product.image ?
                                        <img
                                        className='max-w-[50px] max-h-[50px]'
                                        src={item.product.image}
                                        alt={item.product.name}
                                        loading="lazy" />
                                        :
                                        <img
                                        className='max-w-[50px] max-h-[50px]'
                                        src={PH.src}
                                        alt={item.product.name}
                                        loading="lazy" />}
                                        <div className='text-left self-center px-5'>
                                            <span className='font-bold'>{item.product.name}</span>
                                            <br />
                                            <div className='flex gap-x-2 items-center'>
                                                <span className='text-zinc-800 text-base'>{item.product.price}€</span>
                                                {item.cartItem.size &&
                                                <span>{item.cartItem.size}</span>}
                                                {item.cartItem.color &&
                                                <span 
                                                className={`rounded w-[25px] h-[20px] border text-center bg-${item.cartItem.color.toLowerCase()}-400`}>
                                                </span>}
                                            </div>
                                        </div>
                                    </MenubarItem>
                                </Link>
                                <div 
                                className='flex cursor-pointer hover:bg-red-400 h-[50px] items-center justify-items-center'
                                onClick={() => {removeFromCart(item.cartItem.cartId!); fetchProducts();}}>
                                    <X className='m-auto' />
                                </div>
                            </div>
                        ))}
                        <MenubarItem>
                            <div className='mx-5 text-sm items-center flex justify-end w-full'>
                                TOTAL <span className='text-lg'>{totalPrice}€</span>
                                </div>
                                <Link href={"/checkout"}>
                                    <Button variant='outline'>
                                        CHECKOUT
                                    </Button>
                                </Link>
                        </MenubarItem>
                        </div>}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </>
    )
}