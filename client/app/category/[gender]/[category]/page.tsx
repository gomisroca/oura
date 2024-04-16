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
            <div className='rounded-b-full overflow-hidden w-screen h-[150px] sm:h-[400px] bg-zinc-200 items-center justify-center flex'>
                <BannerImage type='category' gender={gender} />
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] ml-1 md:ml-4 text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                    {gender}
                </div> 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category}
                </div>
            </div>

            <ProductCatalog gender={gender} category={category} />
        </div>
    )
}
