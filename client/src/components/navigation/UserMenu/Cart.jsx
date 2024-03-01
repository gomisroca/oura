import IconButton from '@mui/material/IconButton';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const [cartChanged, setChange] = React.useState(false)
    const [cartEl, setCartEl] = React.useState(null);
    const openCart = Boolean(cartEl);

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

    const handleCart = (event) => {
        setCartEl(event.currentTarget);
    };
    const handleCartClose = () => {
        setCartEl(null);
    };
    const handleItemRemove = (id) => {
        let item = cart.find(x => x.cartID == id);
        const index = cart.indexOf(item);
        if (index > -1) {
            cart.splice(index, 1);
        }
        localStorage.setItem('oura_cart', JSON.stringify(cart));
        setChange(!cartChanged);
    }

    return (
        <>
            <IconButton
                className='hover:stroke-zinc-400'
                id="cart-button"
                aria-controls={openCart ? 'cart-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openCart ? 'true' : undefined}
                onClick={handleCart}
                aria-label={`Cart`}
            >
                <ShoppingCartTwoToneIcon />
            </IconButton>

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
                }}
            >   
                <div className='bg-zinc-200 text-zinc-700'>
                    {cart[0] == null ? 
                        <MenuItem className='w-screen md:w-[500px] cursor-default'>
                            <ListItemText className='p-5 cursor-default text-center'>Nothing in your cart yet</ListItemText>
                        </MenuItem> 
                    : ''}
                    {cart.map((item) => (
                    <div
                    className='w-screen md:w-[500px] flex flex-row text-start items-center'
                    key={item.cartID}>
                        <div 
                        className='p-2 w-full flex flex-row hover:bg-zinc-300 items-center'
                        onClick={() => navigate('/' + item.genre + '/' + item.class + '/' + item.type + '/' + item.id)}
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
                            <ListItemText className='text-left self-center px-5'>
                                <span>{item.title}</span>
                                <br />
                                {item.chosenSize ? 
                                    <div>
                                    <span className='text-sm'>Size: <span className='font-bold'>{item.chosenSize.toUpperCase()}</span></span>
                                    <br />
                                    <span className='text-sm'>Color: <span className='font-bold'>{item.chosenColor.toUpperCase()}</span></span>
                                    <br />
                                    </div>
                                    : undefined
                                }
                                <span className='font-bold'>{item.sale ? item.sale : item.price }€</span>
                            </ListItemText>
                        </div>
                        <ListItemIcon onClick={() => handleItemRemove(item.cartID)}>
                            <ClearIcon className='cursor-pointer hover:bg-zinc-300' />
                        </ListItemIcon>
                    </div>
                    ))}
                    {cart[0] != null ? 
                    <div className='sticky bottom-0 bg-zinc-200 border-t-2 border-zinc-400  flex justify-end p-3 items-center cursor-default'>
                        <span className='mx-5 text-sm'>TOTAL <span className='text-lg'>{totalCartPrice}€</span></span>
                        <div onClick={() => navigate("/checkout")}>
                            <button 
                            className='font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                            onClick={() => handleCartClose()}>
                                CHECKOUT
                            </button>
                        </div>
                    </div> 
                    : '' }
                </div>
            </Menu>

        </>
    )
}