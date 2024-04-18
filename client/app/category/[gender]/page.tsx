import { redirect } from 'next/navigation';
import { BannerImage } from '@/components/ui/banner-image';
import { ProductCatalog } from '@/components/product/product-catalog';
import { getCategories } from '@/utils/categories';

interface Params {
    gender: string;
}

export default async function Catalog({ params } : { params: Params }) {
    const categories = await getCategories();
    if(!(params.gender in categories)){
        redirect('/')
    }

    const gender = params.gender;

    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700'>
            <BannerImage type='category' gender={gender} />
            <ProductCatalog gender={gender} />
        </div>
    )
}
