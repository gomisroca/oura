import {useEffect, useState} from 'react';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { SnackbarCloseReason } from '@mui/base';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    item: Product;
    activeSize: string | null;
}

export default function ColorMenu({ item, activeSize }: Props) {
    const [open, setOpen] = useState<boolean>(false);  
    const [size, setSize] = useState<Size>();

    useEffect(() => {
        if(activeSize){
            let size: Size | undefined = item.sizes.find(s => s.size === activeSize);
            setSize(size);
        }
    }, [item, activeSize])
  
    
    const addToCart = (item: Product, color: string) => {
        setOpen(true);
        if(size){
            let cart_item = {
                cartId: uuidv4(),
                id: item.id,
                size: size!.size,
                color: color,
            }
            let cart: CartItem[] = JSON.parse(localStorage.getItem('oura_cart') || '[]');
            cart.push(cart_item);
            localStorage.setItem('oura_cart', JSON.stringify(cart));
        }
    }

    const handleClose = (event: React.SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <>
        <div onClick={(e) => handleClose}>
            <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </div>
        </>
    );

    return(
        <div className='flex flex-row mx-auto justify-center text-zinc-700'>
            {size ? 
                size.colors.map((color: Color) => (
                    color.amount > 0 ?
                    <Tooltip 
                    key={color.id} 
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={color.name.toUpperCase()}>
                        <span
                        onClick={() => addToCart(item, color.name)}
                        className={`rounded cursor-pointer w-[35px] h-[25px] border-2 border-zinc-400 text-center hover:border-zinc-500 my-2 mx-[10px] bg-${color.name}-400`} 
                        ></span>
                    </Tooltip>
                    : 
                    <span
                    key={color.id} 
                    className={`rounded w-[35px] h-[25px] border-2 border-zinc-400 text-center hover:border-zinc-500 my-2 mx-[2px] bg-${color.name}-400 opacity-30`} 
                    ></span>
                ))
                : 
                <span
                className={`w-[35px] h-[25px] my-2 mx-[10px]`} 
                ></span>
            }
            <Snackbar
                anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
                open={open}
                autoHideDuration={5000}
                onClose={e => handleClose}
                message={'Added ' + item.name + ' to Cart'}
                action={action}
            />
        </div>
    )
}