import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import { SnackbarCloseReason } from '@mui/base';

interface item extends Clothes {
    cartID?: string;
}
interface Props {
    item: item;
}

export default function AddToCart({ item }: Props) {
    const [open, setOpen] = useState<boolean>(false);  
    
    const addToCart = (item: item) => {
        setOpen(true);

        item.cartID = (Math.random() * 9999).toString();
        let cart: CartClothes[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');
        if(item.cartID){
            cart.push(item as CartClothes);
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
        <div className='flex flex-row mx-auto justify-end text-zinc-700'>
            <Tooltip 
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            title="Add to Cart">
                <IconButton className='hover:stroke-black/20' aria-label="Add to Cart">
                    <ShoppingCartTwoToneIcon  onClick={() => addToCart(item)} fontSize='large' />
                </IconButton>
            </Tooltip>
            <Snackbar
            anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
            open={open}
            autoHideDuration={5000}
            onClose={e => handleClose}
            message={'Added ' + item.title + ' to Cart'}
            action={action}
            />
        </div>
    )
}