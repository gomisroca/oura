'use client'

import { useEffect, useState } from "react";
import { getProducts } from "@/utils/products";
import { CatalogSkeleton } from "../skeletons/catalog-skeleton";
import { CardProduct } from "../ui/card-product";

export function ProductCatalog({ gender, category, subcategory } : { gender: string, category?: string, subcategory?: string }) {
    const [products, setProducts] = useState<Product[]>();
    
    async function filterCatalog() {
        const catalog = await getProducts();
        let productArray: Product[];
    
        productArray = catalog.filter(x => (x.gender.includes(gender)));
        if(category == 'season'){
            productArray = productArray.filter(x => x.onSeasonal == true);
        }else if(category){
            productArray = productArray.filter(x => x.category.includes(category));
            if(subcategory){
                productArray = productArray.filter(x => x.subcategory.includes(subcategory));
            }
        }
        setProducts(productArray)
    }

    useEffect(() => {
        if(!products){
            filterCatalog();
        }
    }, [])

    return (
        <>
            {products ?
            <div className='mx-auto p-1 sm:p-5 mb-5'>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                    {products.sort(({sales:a}, {sales:b}) => b-a).map((item) => (
                    <CardProduct item={item} />
                    ))}
                </div>
            </div>
            : <CatalogSkeleton />}
        </>
    )
}