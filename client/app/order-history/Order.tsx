'use client'
import Link from "next/link";
import { useEffect, useState } from "react"

interface Params {
    order: Order;
}

export default function Order({ order } : Params) {
    const [products, setProducts] = useState<Product[]>();
    const [totalPrice, setTotalPrice] = useState<number>();

    const organizeOrderData = (order: Order) => {
        try{
            let productArray: Product[] = [];
            let price = 0;
            for (const product of order.products){
                productArray.push(product.product)

                price =+ product.product.price
            }
            setTotalPrice(price)
            setProducts(productArray)
        }catch(err){
            return err
        }
    }
    if(!products){
        organizeOrderData(order)
    }
   
    
    if(products){
        return (
            <div className="border-2 border-zinc-400 m-2">
                {products.map((item) => (
                <div
                className='flex flex-row text-start items-center'
                key={item.id}>
                    <Link 
                    className='p-2 w-full border-b-2 flex flex-row hover:bg-zinc-300 items-center cursor-pointer justify-between'
                    href={'/category/' + item.gender.toLowerCase() + '/' + item.category.toLowerCase() + '/' + item.subcategory.toLowerCase() + '/' + item.id}
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
                            {item.onSale && 
                            <span className="font-bold text-red-600">
                                ON SALE
                            </span>}
                            <span className='text-zinc-800 text-base'>{item.price}€</span>
                        </div>
                    </Link>
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
  