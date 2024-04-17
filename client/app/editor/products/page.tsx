import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { getProducts } from "@/utils/products";
import Image from "next/image";
import Link from "next/link";
import PH from 'public/images/ph_item.png';

export default async function ProductList() {
    const products = await getProducts();

    return (
        <div className="m-auto grid grid-cols-4 gap-2">
        {products &&
        products.map((product: Product) => (
            <Card className='bg-zinc-200 cursor-pointer flex relative flex-col text-zinc-700 hover:text-zinc-800'>
                <Link 
                href={'products/' + product.id}
                key={product.id} 
                className="h-[275px] md:h-[350px] w-[175px] md:w-[225px]">
                   <div className="rounded-t-md h-2/3 md:h-3/4 w-full items-center justify-center overflow-hidden flex">
                        <AspectRatio ratio={2/3}>
                        {product.image ?
                        <Image
                        fill
                        className="h-full max-w-none mx-auto rounded-t-md object-cover"
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        />
                        :
                        <Image
                        fill
                        className="h-full max-w-none mx-auto rounded-t-md object-cover"
                        src={PH}
                        alt={product.name}
                        loading="lazy"
                        />}
                        </AspectRatio>
                    </div>
                    <div
                    className='mx-2 py-2 flex flex-col absolute bottom-[2px]'>
                        <span className="font-semibold">{product.name}</span>
                        {product.onSale ?
                        <div className="flex flex-row gap-x-2">
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
                </Link>
            </Card>
        ))}
        </div>
    )
}
