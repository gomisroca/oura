import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import CartPlaceholder from '../../../assets/ph_cart.png';
import axios from 'axios';

interface CartProduct {
    cartItem: CartItem;
    product: Product;
}

export default function Cart() {
    const navigate = useNavigate();
    const [cartChanged, setChange] = useState<boolean>(false)
    const [cartEl, setCartEl] = useState<null | HTMLElement>(null);
    const openCart = Boolean(cartEl);
    let cart: CartItem[] = JSON.parse(localStorage.getItem('oura_cart') || '[]');
    const [cartProducts, setCartProducts] = useState<CartProduct[]>();
    const [totalPrice, setTotalPrice] = useState<null | number>();
    
    const fetchProduct = async(id: string): Promise<Product> => {
        try {
            const response = await axios.get<Product>(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${id}`);
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


    const handleCart = (event: React.MouseEvent<HTMLDivElement>) => {
        setCartEl(event.currentTarget);
    };
    const handleCartClose = () => {
        setCartEl(null);
    };
    const handleItemRemove = (id: string) => {
        let item = cart.find(x => x.cartId == id);
        if(item){
            const index = cart.indexOf(item);
            if (index > -1) {
                cart.splice(index, 1);
            }
            localStorage.setItem('oura_cart', JSON.stringify(cart));
            setChange(!cartChanged);
        }
        if(cartProducts){
            let productsItem = cartProducts?.find(x => x.cartItem.cartId == id);
            if(productsItem){
                const index = cartProducts.indexOf(productsItem);
                if (index > -1) {
                    cartProducts.splice(index, 1);
                    setCartProducts(cartProducts)
                }
            }
        }
    }

    return (
        <>
            <div
            className='hover:stroke-zinc-400 text-[1rem] md:text-[1.5rem] items-center flex cursor-pointer transition duration-200'
            id="cart-button"
            aria-controls={openCart ? 'cart-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openCart ? 'true' : undefined}
            onClick={handleCart}
            aria-label={`Cart`}>
                <ShoppingCartTwoToneIcon fontSize='inherit' />
            </div>

            <Menu
            id="cart-menu"
            anchorEl={cartEl}
            open={openCart}
            onClose={handleCartClose}
            MenuListProps={{
            'aria-labelledby': 'cart-button',
            sx: { py: 0 }
            }}
            PaperProps={{
            sx: { borderRadius: 0 }
            }}>   
                <div className='bg-zinc-200 text-zinc-700'>
                    {!cart || (cart && cart.length == 0) ? 
                        <div className='w-screen md:w-[500px] p-5 cursor-default text-center'>
                            There is nothing in your cart yet.
                        </div> 
                    : cart ?
                    <div>
                        {cartProducts && cartProducts.map((item) => (
                        item.cartItem.cartId &&
                        <div
                        className='w-[95vw] md:w-[500px] flex flex-row text-start items-center cursor-pointer border-t border-b border-zinc-400'
                        key={item.cartItem.cartId}>
                            <div 
                            className='h-[120px] py-2 px-4 w-full flex flex-row hover:bg-zinc-300 items-center cursor-pointer'
                            onClick={() => navigate('/' + item.product.gender.toLowerCase() + '/' + item.product.category + '/' + item.product.subcategory + '/' + item.product.id)}>
                                <div className='w-[50px]'>
                                    <img
                                    className='max-w-[50px] max-h-[50px]'
                                    src={`${item.product.image ? item.product.image : CartPlaceholder}`}
                                    srcSet={`${item.product.image ? item.product.image : CartPlaceholder}`}
                                    alt={item.product.name}
                                    loading="lazy" />
                                </div>
                                <div className='text-left self-center px-5'>
                                    <span className='font-bold'>{item.product.name}</span>
                                    <br />
                                    <div className='flex gap-x-2 items-center'>
                                        <span className='text-zinc-800 text-base'>{item.product.price}€</span>
                                        {item.cartItem.size &&
                                        <span>{item.cartItem.size}</span>}
                                        {item.cartItem.color &&
                                        <span 
                                        className={`rounded w-[25px] h-[15px] border-2 border-zinc-400 text-center bg-${item.cartItem.color}-400`}>
                                        </span>}
                                    </div>
                                </div>
                            </div>
                            <div 
                            className='flex cursor-pointer hover:bg-red-300 h-[120px] items-center justify-items-center'
                            onClick={() => handleItemRemove(item.cartItem.cartId!)}>
                                <ListItemIcon>
                                    <ClearIcon className='m-auto' />
                                </ListItemIcon>
                            </div>
                        </div>
                        ))}
                        <div className='sticky bottom-0 bg-zinc-200 border-t-2 border-zinc-400  flex justify-end p-3 items-center cursor-default'>
                            <div className='mx-5 text-sm'>
                               TOTAL <span className='text-lg'>{totalPrice}€</span>
                            </div>
                            <div onClick={() => navigate("/checkout")}>
                                <button 
                                className='font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                                onClick={() => handleCartClose()}>
                                    CHECKOUT
                                </button>
                            </div>
                        </div> 
                    </div>
                    : null}
                </div>
            </Menu>
        </>
    )
}