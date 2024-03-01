import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

export default function AddToCart(props) {
    const [open, setOpen] = React.useState(false);  
    let item = props.item; 
    
    const addToCart = (item) => {
        setOpen(true);

        item.cartID = Math.random() * 9999;
        let cart = localStorage.getItem('oura_cart');

        if(cart == null){
            cart = [];
        } else{
            cart = JSON.parse(cart);
        }
        cart.push(item);
        localStorage.setItem('oura_cart', JSON.stringify(cart));
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
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
            onClose={handleClose}
            message={'Added ' + item.title + ' to Cart'}
            action={action}
            />
        </div>
    )
}