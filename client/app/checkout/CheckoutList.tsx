import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartPlaceholder from '../../assets/ph_cart.png';

interface CartProduct {
    cartItem: CartItem;
    product: Product;
}

export default function CheckoutList() {
    const navigate = useNavigate();
    let cart: CartItem[] = JSON.parse(localStorage.getItem('oura_cart') || '[]');
    const [cartProducts, setCartProducts] = useState<CartProduct[]>();
    const [totalPrice, setTotalPrice] = useState<null | number>();
    
    const fetchProduct = async(id: string): Promise<Product> => {
        try {
            const response = await axios.get<Product>(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
            return response.data;
        }
        catch(error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            let cart_products: CartProduct[] = [];
            for(const cartItem of cart) {
                try {
                    const product = await fetchProduct(cartItem.id);
                    const cart_product = {
                        cartItem: cartItem,
                        product: product
                    }
                    cart_products.push(cart_product);
                } catch (error: unknown) {
                    console.error(`Failed to fetch product with ID ${cartItem.id}: ${error}`);
                }
            }
            setCartProducts(cart_products)

            let totalCartPrice = 0;
            for (let i = 0; i < cart_products.length; i++) {
                totalCartPrice = totalCartPrice + cart_products[i].product.price
            }
            totalCartPrice = Math.floor(totalCartPrice * 100) / 100;
            setTotalPrice(Number(totalCartPrice));
        }

        fetchProducts();
    }, [])
    return (
        <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700 mt-5 md:mt-16'>
            {cart.length == 0 ? 
                <div 
                className='p-2 flex justify-center'>
                    There is nothing in your cart yet.
                </div>
            : 
            <div>
                {cartProducts && cartProducts.map((item) => (
                <div
                className='flex flex-row text-start items-center'
                key={item.cartItem.cartId}>
                    <div 
                    className='p-2 w-full border-b-2 flex flex-row hover:bg-zinc-300 items-center cursor-pointer'
                    onClick={() => navigate('/' + item.product.gender.toLowerCase() + '/' + item.product.category + '/' + item.product.subcategory + '/' + item.product.id)}
                    >
                        <div className='w-[50px]'>
                            <img
                            className='max-w-[50px] max-h-[50px]'
                            src={`${item.product.image ? item.product.image : CartPlaceholder}`}
                            srcSet={`${item.product.image ? item.product.image : CartPlaceholder}`}
                            alt={item.product.name}
                            loading="lazy"
                            />
                        </div>
                        <div className='text-justify self-center px-5'>
                            <span>{item.product.name}</span>
                            <br />
                            <div className='flex gap-x-2 items-center'>
                                <span className='text-zinc-800 text-base'>{item.product.price}€</span>
                                {item.cartItem.size ?
                                <span>{item.cartItem.size.toUpperCase()}</span>
                                : null }
                                {item.cartItem.color ?
                                <span 
                                className={`rounded w-[25px] h-[15px] border-2 border-zinc-400 text-center bg-${item.cartItem.color}-400`}>
                                </span>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
                ))}
                <div className='border-t-2 border-zinc-400 flex justify-end p-3 items-center cursor-default'>
                    <div className='mx-5 text-sm'>
                        <span className="mr-1">
                            TOTAL
                        </span>
                        <span className='text-lg'>
                            {totalPrice}€
                        </span>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}