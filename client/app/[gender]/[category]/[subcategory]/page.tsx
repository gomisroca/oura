'use client'

import { useEffect, useState } from "react";
import axios from 'axios';

import VerticalBannerPlaceholder from '../../../../public/images/ph_vbanner.png';
import ItemPlaceholder from '../../../../public/images/ph_item.png';

import Filter from './Filter';
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Params {
    gender: string;
    category?: string;
    subcategory?: string;
}

export default function Catalog({ params } : { params: Params }) {
    const { push } = useRouter();

    const gender = params.gender;
    const category = params.category;
    const subcategory = params.subcategory;

    const [catalog, setCatalog] = useState<Product[]>();
    const [products, setProducts] = useState<Product[]>();
    const [sizeFilteredProduct, setSizeFilteredProducts] = useState<Product[]>();
    const [settings, setSettings] = useState<CategorySettings>();

    const fetchCategorySettings = async() => {
        await axios.get<CategorySettings>(`${process.env.NEXT_PUBLIC_API_URL}/settings/categories/${gender}`)
        .then((res) => {
            console.log(res.data)
            setSettings(res.data);
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

    const fetchCatalog = () => {
        axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/products/`)
        .then((res) => {
            setCatalog(res.data);
            filterCatalog(res.data);
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
    
    const filterCatalog = (catalog: Product[]) => {
        let productArray: Product[];
        if (gender !== 'season'){
            productArray = catalog.filter(x => (x.gender.toLowerCase() == gender));
        } else{
            productArray = catalog.filter(x => (x.onSeasonal == true));
        }
        if(category == 'season'){
            productArray = productArray.filter(x => x.onSeasonal == true);
        } else if (category != undefined) {
            productArray = productArray.filter(x => x.category == category);
        }
        if(subcategory != undefined){
            productArray = productArray.filter(x => x.subcategory == subcategory);
        }
        setProducts(productArray);
        setSizeFilteredProducts(productArray);
    }

    useEffect(() => {
        if(gender){
            fetchCategorySettings();
        }
        if (catalog) {
            filterCatalog(catalog);
        } else{
            fetchCatalog();
        }
    }, [gender, category, subcategory])

    const handleUpdateProducts = (data: Product[]) => {
        setSizeFilteredProducts(data);
    }

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <div className='flex h-[150px] md:h-[400px] w-screen overflow-hidden items-center'>
                <Image
                className= 'w-screen brightness-75'
                src={settings?.image ? settings.image : VerticalBannerPlaceholder}
                alt="Sale Image"
                />
                {category ? 
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] ml-1 md:ml-4 text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                    {gender}
                </div> 
                : 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div>
                }

                {category ? 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category}
                </div> 
                : 
                undefined
                }

                {subcategory ? 
                <div className='absolute uppercase text-[35px] md:text-[100px] text-zinc-200 ml-1 md:ml-3 self-center justify-self-center mt-[65px] md:mt-[230px]'>
                    {subcategory}
                </div> 
                : 
                undefined
                }
            </div>

            {products &&
            <Filter products={products} updateProducts={handleUpdateProducts} />}

            {sizeFilteredProduct ?
            <div className='mx-auto p-1 sm:p-5 mb-5'>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                    {sizeFilteredProduct.sort(({sales:a}, {sales:b}) => b-a).map((item) => (
                    <div 
                    key={item.id}
                    className='cursor-pointer transition duration-200 h-[275px] md:h-[350px] w-[175px] md:w-[225px] flex relative flex-col bg-zinc-200 hover:bg-zinc-300 border-zinc-400 hover:border-zinc-500 text-zinc-700 hover:text-zinc-800 border-2' 
                    onClick={() => push('/' + item.gender.toLowerCase() + '/' + item.category + '/' + item.subcategory + '/' + item.id)}>
                        <div className="h-2/3 md:h-3/4 overflow-y-hidden bg-white items-center flex">
                            <Image
                            className="mx-auto"
                            src={`${item.image ? item.image : ItemPlaceholder}`}
                            alt={item.name}
                            loading="lazy"
                            />
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
                    </div>
                    ))}
                </div>
            </div>
            : 
            null}
        </div>
    )
}
