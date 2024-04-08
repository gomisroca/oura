import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>();

    useEffect(() => {
        axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/products`)
        .then(res => {
            setProducts(res.data)
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
    }, [])

    return (
        <div className="flex flex-col gap-2 mt-5">
        {products &&
        products.map((product: Product) => (
            <div 
            onClick={() => navigate(product.id)}
            key={product.id} 
            className="text-center w-[250px] flex flex-col border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 p-4 cursor-pointer">
                <img src={product.image} />
                <span className="border-b border-zinc-400 p-2">{product.name}</span>
                <div className="text-center m-auto flex flex-row gap-2 p-2">
                    <span>{product.gender}</span>
                    <span>{product.category}</span>
                    <span>{product.subcategory}</span>
                </div>
            </div>
        ))}
        </div>
    )
}
