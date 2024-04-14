import VerticalBannerPlaceholder from 'public/images/ph_vbanner.png';
import ItemPlaceholder from 'public/images/ph_item.png';

import Image from "next/image";
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Params {
    gender: string;
}

async function getCategories() {
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`)
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}

async function getCategorySettings(gender: string){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories/${gender}`);
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}

async function getCatalog(){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`);
        if(!res.ok){
            return null
        }
        return res.json()
    } catch(err){
        console.log(err)
    }
}

async function filterCatalog(gender) {
    const catalog = await getCatalog();

    let productArray: Product[];

    productArray = catalog.filter(x => (x.gender.toLowerCase() == gender));

    return productArray;
}

export default async function Catalog({ params } : { params: Params }) {
    const categories = await getCategories();
    if(!(params.gender in categories)){
        redirect('/')
    }
    const settings = await getCategorySettings(params.gender);

    const gender = params.gender;
    let products: Product[] = await filterCatalog(gender);

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <div className='overflow-hidden w-screen h-[150px] sm:h-[400px] bg-white items-center justify-center flex'>
                <img
                className='w-screen brightness-75'
                src={settings?.image ? settings.image : VerticalBannerPlaceholder}
                alt="Sale Image"
                />
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div>
            </div>

            {products &&
            <div className='mx-auto p-1 sm:p-5 mb-5'>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                    {products.sort(({sales:a}, {sales:b}) => b-a).map((item) => (
                    <Link 
                    key={item.id}
                    className='cursor-pointer transition duration-200 h-[275px] md:h-[350px] w-[175px] md:w-[225px] flex relative flex-col bg-zinc-200 hover:bg-zinc-300 border-zinc-400 hover:border-zinc-500 text-zinc-700 hover:text-zinc-800 border-2' 
                    href={'/category/' + item.gender.toLowerCase() + '/' + item.category + '/' + item.subcategory + '/' + item.id}>
                        <div className="h-2/3 md:h-3/4 w-full bg-white items-center justify-center overflow-hidden flex">
                            {item.image ?
                            <img
                            className="h-full max-w-none mx-auto"
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            />
                            :
                            <img
                            className="h-full max-w-none mx-auto"
                            src={ItemPlaceholder.src}
                            alt={item.name}
                            loading="lazy"
                            />}
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
                    ))}
                </div>
            </div>}
        </div>
    )
}
