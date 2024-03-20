import { useNavigate } from "react-router-dom";

export default function CheckoutList() {
    const navigate = useNavigate();

    let cart: CartClothes[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');
    
    let totalCartPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        if(cart[i].sale){
            totalCartPrice = totalCartPrice + cart[i].sale
        } else{
            totalCartPrice = totalCartPrice + cart[i].price
        }
    }
    totalCartPrice = Math.floor(totalCartPrice * 100) / 100;

    return (
        <div className='mx-2 md:mx-0 flex flex-col overflow-hidden border-2 border-zinc-400 text-zinc-700 mt-5 md:mt-16'>
            {cart[0] == null ? 
                <div 
                className='p-2 flex justify-center'>
                    There is nothing in your cart yet.
                </div>
            : 
            <div>
                {cart.map((item) => (
                <div
                className='flex flex-row text-start items-center'
                key={item.cartID}>
                    <div 
                    className='p-2 w-full border-b-2 flex flex-row hover:bg-zinc-300 items-center cursor-pointer'
                    onClick={() => navigate('/' + item.genre.toLowerCase() + '/' + item.class + '/' + item.type + '/' + item.id)}
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
                        <div className='text-justify self-center px-5'>
                            <span>{item.title}</span>
                            <br />
                            <div className='flex gap-x-2 text-sm items-center'>
                                <span className='text-zinc-800 text-base'>{item.sale ? item.sale : item.price}€</span>
                                {item.chosenSize ?
                                <span>{item.chosenSize.toUpperCase()}</span>
                                : null }
                                {item.chosenColor ?
                                <span>{item.chosenColor.toUpperCase()}</span>
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
                            {totalCartPrice}€
                        </span>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}