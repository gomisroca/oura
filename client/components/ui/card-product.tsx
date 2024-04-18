import Image from "next/image"
import PH from '@/public/images/ph_item.png'
import Link from "next/link";
import { Card } from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";

export function CardProduct({ item } : { item: Product }) {
    return (
        <>
            <Card className='bg-zinc-200 cursor-pointer flex relative flex-col text-zinc-700 hover:text-zinc-800'>
                <Link 
                key={item.id}
                className="h-[275px] md:h-[350px] w-[175px] md:w-[225px]"
                href={'/category/' + item.gender[0].toLowerCase() + '/' + item.category[0].toLowerCase() + '/' + item.subcategory[0].toLowerCase() + '/' + item.id}>
                    <div className="rounded-t-md h-2/3 md:h-3/4 w-full items-center justify-center overflow-hidden flex">
                        <AspectRatio ratio={2/3}>
                        {item.image ?
                        <Image
                        fill
                        className="h-full max-w-none mx-auto rounded-t-md object-cover"
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        />
                        :
                        <Image
                        fill
                        className="h-full max-w-none mx-auto rounded-t-md object-cover"
                        src={PH}
                        alt={item.name}
                        loading="lazy"
                        />}
                        </AspectRatio>
                    </div>
                    <div
                    className='mx-2 py-2 flex flex-col absolute bottom-[2px]'>
                        <span className="font-semibold">{item.name}</span>
                        {item.onSale ?
                        <div className="flex flex-row gap-x-2">
                            <span className="font-bold text-red-600">
                                ON SALE
                            </span> 
                            <span>
                                {item.price}€
                            </span>
                        </div>
                        : 
                        <span>{item.price}€</span>
                        }
                    </div>
                </Link>
            </Card>
        </>
    )
}