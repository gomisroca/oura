import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

import Skeleton from '@mui/material/Skeleton';

import SizeMenu from "./SizeMenu";
import AddToCart from "./AddToCart";
import RelatedItems from "./RelatedItems";

function Product() {
    const gender = useParams().gender;
    const category = useParams().category;
    const id = useParams().product;

    const [product, setProduct] = useState<Product>();
    const [catalog, setCatalog] = useState<Product[]>();

    const fetchCatalog = () => {
        axios.get<Product[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/products`)
        .then((res) => {
            setCatalog(res.data);
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }

    useEffect(() => {
        fetchCatalog();
    }, []);

    useEffect(() => {
        if(id){
            axios.get<Product>(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${id}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch(error => {
                if(error.response){
                    console.log(error.response)
                } else if(error.request){
                    console.log(error.request)
                } else{
                    console.log(error.message)
                }
            })
        }
    }, [id]);

    return (
        <div className='flex flex-col overflow-hidden h-full text-gray-700'>
            {product ?
            <div className="flex flex-col md:flex-row p-4 sm:p-10 w-[95vw] sm:w-4/5 cursor-default mt-8 self-center transition duration-200 from-gray-200 to-gray-400/30 hover:from-gray-300 hover:to-gray-400/30 border-zinc-400 hover:border-zinc-500 border-2">
                <div className="mx-auto h-[400px] sm:h-[600px] md:w-1/2 overflow-y-hidden bg-white border-2 border-zinc-400 hover:border-zinc-500 transition duration-200 items-center flex">
                    <img
                    className='mx-auto'
                    src={`${product.image}`}
                    srcSet={`${product.image}`}
                    alt={product.name}
                    loading="lazy"
                    />
                </div>
                <div className="md:pl-10 md:w-1/2 mt-2 md:mt-0">
                    <div className="border-zinc-400">
                        {product.sizes ? 
                        <SizeMenu item={product} /> 
                        : 
                        <AddToCart item={product} /> 
                        }
                    </div>
                    <div className="justify-between p-2 flex text-lg font-bold border-t-2 border-zinc-400 md:mt-4 md:pt-4">
                        <div>{product.name}</div>
                        <div>
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
                    <div className="p-2 overflow-clip text-justify">
                        {product.description}
                    </div>
                </div>
            </div>
            : <Skeleton variant="rectangular" />}
            {catalog && product && gender && category &&
            <RelatedItems catalog={catalog} item={product} gender={gender} category={category} />}
        </div>
    )
}

export default Product
