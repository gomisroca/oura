import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface Props {
    order: Order;
}

export default function Order({ order }: Props) {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>();
    const [totalPrice, setTotalPrice] = useState<number>();

    const organizeOrderData = (order: Order) => {
        try{
            let productArray = [];
            let price = 0;
            for (const product of order.products){
                let parsedProduct = JSON.parse(product)
                productArray.push(parsedProduct)

                if(parsedProduct.sale){
                    price =+ parsedProduct.sale
                }else{
                    price =+ parsedProduct.price
                }
            }
            setTotalPrice(price)
            setProducts(productArray)
        }catch(err){
            return err
        }
    }

    useEffect(() => {
        organizeOrderData(order)
    }, [order])
    
    if(products){
        return (
            <div className="border-2 border-zinc-400 m-2">
                {products.map((item) => (
                <div
                className='flex flex-row text-start items-center'
                key={item.id}>
                    <div 
                    className='p-2 w-full border-b-2 flex flex-row hover:bg-zinc-300 items-center cursor-pointer justify-between'
                    onClick={() => navigate('/' + item.gender.toLowerCase() + '/' + item.category.toLowerCase() + '/' + item.subcategory.toLowerCase() + '/' + item.id)}
                    >
                        <div className='w-[50px]'>
                            <img
                            className='max-w-[50px] max-h-[150px]'
                            src={`${item.image}`}
                            srcSet={`${item.image}`}
                            alt={item.name}
                            loading="lazy"
                            />
                        </div>
                        <div className='text-justify self-center px-5'>
                            <span>{item.name}</span>
                            <br />
                            <span className='text-zinc-800 text-base'>{item.sale ? item.sale : item.price}€</span>
                        </div>
                    </div>
                </div>
                ))}
                <div className='border-t-2 border-zinc-400 flex justify-end p-3 items-center cursor-default'>
                    <span className='mx-5 text-sm'>TOTAL <span className='text-lg'>{totalPrice}€</span></span>
                </div>
            </div>
        )
    } else {
        return null
    }
}
  