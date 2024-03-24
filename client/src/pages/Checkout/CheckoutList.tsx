import { useNavigate } from "react-router-dom";

export default function CheckoutList() {
    const navigate = useNavigate();

    let cart: Product[] = JSON.parse(localStorage.getItem('oura_cart') || '{}');
    
    let totalCartPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        totalCartPrice = totalCartPrice + cart[i].price
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
                    onClick={() => navigate('/' + item.gender.toLowerCase() + '/' + item.category + '/' + item.subcategory + '/' + item.id)}
                    >
                        <div className='w-[50px]'>
                            <img
                            className='max-w-[50px] max-h-[50px]'
                            src={`${item.image}`}
                            srcSet={`${item.image}`}
                            alt={item.name}
                            loading="lazy"
                            />
                        </div>
                        <div className='text-justify self-center px-5'>
                            <span>{item.name}</span>
                            <br />
                            <div className='flex gap-x-2 items-center'>
                                <span className='text-zinc-800 text-base'>{item.price}€</span>
                                {item.size ?
                                <span>{item.size.toUpperCase()}</span>
                                : null }
                                {item.color ?
                                <span 
                                className={`rounded w-[25px] h-[15px] border-2 border-zinc-400 text-center bg-${item.color}-400`}>
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
                            {totalCartPrice}€
                        </span>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}