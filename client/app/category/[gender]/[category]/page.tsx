import { redirect } from 'next/navigation';
import { BannerImage } from '@/components/ui/banner-image';
import { ProductCatalog } from '@/components/product/product-catalog';
import { getCategory } from '@/utils/categories';

interface Params {
    gender: string;
    category: string;
}

export default async function Catalog({ params } : { params: Params }) {    
    const categories: Category | null = await getCategory(params.gender);
    if(params.category !== 'season' && (!categories || !(params.category in categories))){
        redirect('/')
    }

    const gender = params.gender;
    const category = params.category;

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <BannerImage type='category' gender={gender} category={category} />
            <ProductCatalog gender={gender} category={category} />
        </div>
    )
}
