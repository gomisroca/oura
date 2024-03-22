import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';

export default function Cart() {
    const navigate = useNavigate();
    const [cartChanged, setChange] = useState<boolean>(false)
    const [cartEl, setCartEl] = useState<null | HTMLElement>(null);
    const openCart = Boolean(cartEl);
    
    let cart: Product[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');

    let totalCartPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        totalCartPrice = totalCartPrice + cart[i].price
    }
    totalCartPrice = Math.floor(totalCartPrice * 100) / 100;

    const handleCart = (event: React.MouseEvent<HTMLDivElement>) => {
        setCartEl(event.currentTarget);
    };
    const handleCartClose = () => {
        setCartEl(null);
    };
    const handleItemRemove = (id: string) => {
        let item = cart.find(x => x.cartID == id);
        if(item){
            const index = cart.indexOf(item);
            if (index > -1) {
                cart.splice(index, 1);
            }
            localStorage.setItem('oura_cart', JSON.stringify(cart));
            setChange(!cartChanged);
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
                    {cart && cart[0] == null ? 
                        <div className='w-screen md:w-[500px] p-5 cursor-default text-center'>
                            There is nothing in your cart yet.
                        </div> 
                    : cart ?
                    <div>
                        {cart.map((item) => (
                        item.cartID &&
                        <div
                        className='w-[95vw] md:w-[500px] flex flex-row text-start items-center cursor-pointer border-t border-b border-zinc-400'
                        key={item.cartID}>
                            <div 
                            className='h-[120px] py-2 px-4 w-full flex flex-row hover:bg-zinc-300 items-center cursor-pointer'
                            onClick={() => navigate('/' + item.gender.toLowerCase() + '/' + item.category + '/' + item.subcategory + '/' + item.id)}>
                                <div className='w-[50px]'>
                                    <img
                                    className='max-w-[50px] max-h-[50px]'
                                    src={`${item.image}`}
                                    srcSet={`${item.image}`}
                                    alt={item.name}
                                    loading="lazy" />
                                </div>
                                <div className='text-left self-center px-5'>
                                    <span className='font-bold'>{item.name}</span>
                                    <br />
                                    <div className='flex gap-x-2 text-sm items-center'>
                                        <span className='text-zinc-800 text-base'>{item.price}€</span>
                                        {item.size ?
                                        <span>{item.size.toUpperCase()}</span>
                                        : null }
                                        {item.color ?
                                        <span>{item.color.toUpperCase()}</span>
                                        : null}
                                    </div>
                                </div>
                            </div>
                            <div 
                            className='flex cursor-pointer hover:bg-red-300 h-[120px] items-center justify-items-center'
                            onClick={() => handleItemRemove(item.cartID!)}>
                                <ListItemIcon>
                                    <ClearIcon className='m-auto' />
                                </ListItemIcon>
                            </div>
                        </div>
                        ))}
                        <div className='sticky bottom-0 bg-zinc-200 border-t-2 border-zinc-400  flex justify-end p-3 items-center cursor-default'>
                            <span className='mx-5 text-sm'>
                                TOTAL <span className='text-lg'>{totalCartPrice}€</span>
                            </span>
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