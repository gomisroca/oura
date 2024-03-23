import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductUpdate() {
    const [product, setProduct] = useState<Product>();
    const id = useParams().id;

    useEffect(() => {
        axios.get<Product>(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${id}`)
        .then(res => {
            setProduct(res.data)
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
    }, [id])
    
    return (
        <>
        {product &&
        <div
        key={product.id} 
        className="text-center w-[250px] flex flex-col border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 p-4 mt-5 cursor-pointer">
            <img src={product.image} />
            <span className="border-b border-zinc-400 p-2">{product.name}</span>
            <div className="text-center m-auto flex flex-row gap-2 p-2">
                <span>{product.gender}</span>
                <span>{product.category}</span>
                <span>{product.subcategory}</span>
            </div>
        </div>}
        </>
    )
}