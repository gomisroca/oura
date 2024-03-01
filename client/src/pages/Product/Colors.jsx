import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

export default function Colors(props) {
    const [open, setOpen] = React.useState(false);  

    let item = props.item; 
    let sizes;
    if(item.chosenSize){
        sizes = item.sizes[item.chosenSize];
    }
    
    const addToCart = (item, color) => {
        setOpen(true);

        item.cartID = Math.random() * 9999;
        let cart = localStorage.getItem('oura_cart');

        if(cart == null){
          cart = [];
        } else{
          cart = JSON.parse(cart);
        }
        item.chosenColor = color;
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
        <div className='flex flex-row mx-auto justify-center text-zinc-700'>
            {sizes ? 
                sizes.map((color) => (
                    color.amount > 0 ?
                    <Tooltip 
                    key={color._id} 
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={color.colorName.toUpperCase()}>
                        <span
                        onClick={() => addToCart(item, color.colorName)}
                        className={`rounded cursor-pointer w-[35px] h-[25px] border-2 border-zinc-400 text-center hover:border-zinc-500 my-2 mx-[10px] ${color.colorClass}`} 
                        ></span>
                    </Tooltip>
                    : <span
                    key={color._id} 
                    className={`rounded w-[35px] h-[25px] border-2 border-zinc-400 text-center hover:border-zinc-500 my-2 mx-[2px] ${color.colorClass} opacity-30`} 
                    ></span>
                ))
                : undefined
            }
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