'use client'

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useContext, useState } from 'react';
import { SnackbarCloseReason } from '@mui/base';
import CartContext from '@/contexts/cart';

interface Props {
    item: Product;
}

export default function AddToCart({ item }: Props) {
    const [open, setOpen] = useState<boolean>(false);  
    const { addToCart } = useContext(CartContext);

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
            message={'Added ' + item.name + ' to Cart'}
            action={action}
            />
        </div>
    )
}