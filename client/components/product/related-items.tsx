import Link from 'next/link';
import PH from '@/public/images/ph_item.png'
import { Card } from '../ui/card';
import { CardProduct } from '../ui/card-product';

interface Props {
    catalog: Product[];
    item: Product;
    gender: string;
    category: string;
}

function filterCatalog(catalog, item, gender, category): Product[] {
    let itemDataArray = catalog.filter(x => (x.gender.includes(gender.toLowerCase())) && x.category.includes(category.toLowerCase()));
    let filter = itemDataArray.find(x => x.id == item.id);
    if (filter){
        const index = itemDataArray.indexOf(filter);
        if (index > -1) {
            itemDataArray.splice(index, 1);
        }
        itemDataArray = itemDataArray.slice(0,4);
    }
    return itemDataArray;
}

export default function RelatedItems({ catalog, item, gender, category }: Props) {
    let itemData: Product[] = filterCatalog(catalog, item, gender, category);

    return (
        <div className='mx-auto mt-3 px-2 mb-10'>
            {itemData && itemData.length > 0 &&
            <div>
                <div className='mb-2 text-lg text-center font-semibold'>RELATED ITEMS</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {itemData.map((item) => (
                        <CardProduct item={item} />
                    ))}
                </div>
            </div>}
        </div>
    )
}
