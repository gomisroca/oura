import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import Skeleton from '@mui/material/Skeleton';

import ManImg from '../../assets/categories/man.jpg';
import WomanImg from '../../assets/categories/woman.jpg';
import OutdoorsImg from '../../assets/categories/outdoors.jpg';

import Filter from './Filter';

export default function Catalog() {
    const navigate = useNavigate();

    const genre = useParams().genre;
    const category = useParams().category;
    const type = useParams().type;

    const [catalog, setCatalog] = useState<Clothes[]>();
    const [products, setProducts] = useState<Clothes[]>();
    const [sizeFilteredProduct, setSizeFilteredProducts] = useState<Clothes[]>();

    const fetchCatalog = () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/clothes/catalog`)
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
    
    const filterCatalog = (catalog: Clothes[]) => {
        let productArray: Clothes[];
        if (genre !== 'season'){
            productArray = catalog.filter(x => (x.genre.toLowerCase() == genre || x.genre == 'neutral'));
        } else{
            productArray = catalog.filter(x => (x.seasonal == true));
        }
        if(category == 'season'){
            productArray = productArray.filter(x => x.seasonal == true);
        } else if (category != undefined) {
            productArray = productArray.filter(x => x.class == category);
        }
        if(type != undefined){
            productArray = productArray.filter(x => x.type == type);
        }
        setProducts(productArray);
        setSizeFilteredProducts(productArray);
    }

    useEffect(() => {
        if (catalog) {
            filterCatalog(catalog);
        } else{
            fetchCatalog();
        }
    }, [genre, category, type])

    const handleUpdateProducts = (data: Clothes[]) => {
        setSizeFilteredProducts(data);
    }

    let banner;
    switch(genre){
        case 'man':
            banner = ManImg;
            break;
        case 'woman':
            banner = WomanImg;
            break;
        default:
            banner = OutdoorsImg;
            break;
    }

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <div className='grid sm:h-[100px] md:h-[400px] w-screen'>
                {banner ? 
                <img
                className= 'w-screen brightness-75'
                src={banner}
                alt="Sale Image"
                />
                : 
                <Skeleton variant="rectangular" />
                }

                {category ? 
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                    {genre}
                </div> 
                : 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {genre}
                </div>
                }

                {category ? 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category}
                </div> 
                : 
                undefined
                }

                {type ? 
                <div className='absolute uppercase text-[35px] md:text-[100px] text-zinc-200 self-center justify-self-center mt-[65px] md:mt-[230px]'>
                    {type}
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
                    onClick={() => navigate('/' + item.genre.toLowerCase() + '/' + item.class + '/' + item.type + '/' + item.id)}>
                        <div className="h-2/3 md:h-3/4 overflow-y-hidden bg-white items-center flex">
                            <img
                            className="mx-auto"
                            src={`${item.image}`}
                            srcSet={`${item.image}`}
                            alt={item.title}
                            loading="lazy"
                            />
                        </div>
                        <div
                        className='mx-2 py-2 flex flex-col absolute bottom-[2px]'>
                            <span className="font-semibold">{item.title}</span>
                            {item.sale ?
                            <div className="flex flex-row gap-x-2">
                                <span>
                                    {item.sale}€
                                </span> 
                                <span className="line-through decoration-2 decoration-red-600/70">
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
