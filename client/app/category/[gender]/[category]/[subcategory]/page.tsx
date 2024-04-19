import { redirect } from 'next/navigation';
import { ProductCatalog } from '@/components/product/product-catalog';
import { BannerImage } from '@/components/ui/banner-image';
import { getCategory } from '@/utils/categories';

interface Params {
    gender: string;
    category: string;
    subcategory: string;
}

export default async function Catalog({ params } : { params: Params }) {    
    const categories: Category | null = await getCategory(params.gender);
    if(categories && (!categories[params.category] || !categories[params.category].includes(params.subcategory))){
       redirect('/')
    }

    const gender = params.gender;
    const category = params.category;
    const subcategory = params.subcategory;


    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <BannerImage type='category' gender={gender} category={category} subcategory={subcategory} />
            <ProductCatalog gender={gender} category={category} subcategory={subcategory} />
        </div>
    )
}
