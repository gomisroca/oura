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
            <div className='rounded-b-full overflow-hidden w-screen h-[150px] sm:h-[400px] bg-zinc-200 items-center justify-center flex'>
                <BannerImage type='category' gender={gender} />
                <div className='cursor-default absolute uppercase text-[20px] md:text-[50px] ml-1 md:ml-4 text-zinc-200 self-center justify-self-center mb-[50px] md:mb-[180px]'>
                    {gender}
                </div> 
                <div className='cursor-default absolute uppercase text-[50px] md:text-[200px] text-zinc-200 self-center justify-self-center'>
                    {category}
                </div> 
                <div className='absolute uppercase text-[35px] md:text-[100px] text-zinc-200 ml-1 md:ml-3 self-center justify-self-center mt-[65px] md:mt-[230px]'>
                    {subcategory}
                </div> 
            </div>

            <ProductCatalog gender={gender} category={category} subcategory={subcategory} />
        </div>
    )
}
