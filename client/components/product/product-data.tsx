'use client'

import { useEffect, useState } from "react";
import PH from '@/public/images/ph_fullitem.png'
import AddToCart from "@/components/product/add-to-cart";
import SizeMenu from "@/components/product/size-menu";
import { getProduct } from "@/utils/products";
import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { ProductSkeleton } from "../skeletons/product-skeleton";

export function ProductData({ id } : { id: string}){
    const [product, setProduct] = useState<Product>();
    async function fetchProduct(id: string) {
        try{
            const data = await getProduct(id)  
            if(data){
                setProduct(data)
            }
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchProduct(id)
    }, [])

    if(product){
    return(
        <>
            <Card className="overflow-hidden m-auto h-fit w-full xl:w-1/2 items-center justify-center flex">
                <AspectRatio ratio={3/2}>
                {product.image ?
                <Image
                fill
                className="rounded-md object-cover"
                src={product.image}
                alt={product.name}
                />
                :
                <Image
                fill
                className='mx-auto'
                src={PH}
                alt={product.name}
                />}
                </AspectRatio>
            </Card>
            <div className="xl:pl-10 xl:w-1/2 text-zinc-700 xl:mt-8">
                <div className="my-2 border-zinc-400">
                    {product.sizes.length > 0 ? 
                    <SizeMenu item={product} /> 
                    : 
                    <AddToCart item={product} /> 
                    }
                </div>
                <div className="justify-between p-2 flex font-bold border-t-2 border-zinc-400">
                    <div className="text-[1.1rem] md:text-[1.3rem]">{product.name}</div>
                    <div className="text-[1.05rem] md:text-[1.2rem]">
                        {product.onSale ?
                        <div className="flex gap-x-2">
                            <span className="font-bold text-red-600">
                                ON SALE
                            </span> 
                            <span>
                                {product.price}€
                            </span>
                        </div>
                        : 
                        <span>{product.price}€</span> 
                        }
                    </div>
                </div>
                <div className="p-2 overflow-clip text-justify text-[1.025rem] md:text-[1.1rem]">
                    {product.description}
                </div>
            </div>
        </>
    )} else{
        return (
            <ProductSkeleton />
        )
    }
}