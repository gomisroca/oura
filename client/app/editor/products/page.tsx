import { getProducts } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import ItemPlaceholder from 'public/images/ph_item.png';

export default async function ProductList() {
    const products = await getProducts();

    return (
        <div className="grid grid-cols-4 gap-2 mt-5">
        {products &&
        products.map((product: Product) => (
            <Link 
            href={'products/' + product.id}
            key={product.id} 
            className="text-center h-[275px] sm:h-[275px] md:h-[350px] w-[175px] md:w-[225px] flex flex-col border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 p-4 cursor-pointer">
                <div className="h-2/3 md:h-3/4 w-full bg-zinc-200 items-center justify-center overflow-hidden flex">
                    <img
                    className="h-full max-w-none mx-auto"
                    src={product.image ? product.image : ItemPlaceholder.src} 
                    alt={product.name}
                    />
                </div>
                <span className="border-b border-zinc-400 p-2">{product.name}</span>
                <div className="text-center m-auto grid grid-cols-1 gap-2 p-2">
                    <span>{product.gender}</span>
                    <span>{product.category}</span>
                    <span>{product.subcategory}</span>
                </div>
            </Link>
        ))}
        </div>
    )
}
