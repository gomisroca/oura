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
            <div className='rounded-b-full overflow-hidden w-screen h-[150px] sm:h-[400px] bg-zinc-200 items-center justify-center flex'>
                <BannerImage type='category' gender={gender} />
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {gender}
                </div>
            </div>

            <ProductCatalog gender={gender} />
        </div>
    )
}
