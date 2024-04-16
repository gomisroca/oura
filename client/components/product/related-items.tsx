import Link from 'next/link';
import ItemPlaceholder from 'public/images/ph_item.png';

interface Props {
    catalog: Product[];
    item: Product;
    gender: string;
    category: string;
}

function filterCatalog(catalog, item, gender, category): Product[] {
    let itemDataArray = catalog.filter(x => (x.gender.toLowerCase() == gender.toLowerCase()) && x.category.toLowerCase() == category.toLowerCase());
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
                    {itemData.map((product) => (
                        <Link
                        key={product.id}
                        className="h-full flex relative flex-col cursor-pointer"
                        href={'/category/' + product.gender.toLowerCase() + '/' + product.category + '/' + product.subcategory + '/' + product.id}>
                            <div
                            className='cursor-pointer transition duration-200 h-[275px] sm:h-[275px] md:h-[350px] w-[175px] md:w-[225px] flex relative flex-col bg-zinc-200 hover:bg-zinc-300 border-zinc-400 hover:border-zinc-500 text-zinc-700 hover:text-zinc-800 border-2'
                            key={product.id}>
                                <div className="h-2/3 md:h-3/4 w-full bg-white items-center justify-center overflow-hidden flex">
                                    {product.image ?
                                    <img
                                    className="h-full max-w-none mx-auto"
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    />
                                    :
                                    <img
                                    className="h-full max-w-none mx-auto"
                                    src={ItemPlaceholder.src}
                                    alt={product.name}
                                    loading="lazy"
                                    />}
                                </div>
                                <div
                                className='mx-2 py-2 flex flex-col absolute bottom-[2px]'>
                                    <span className="font-semibold">{product.name}</span>
                                    {product.onSale ?
                                    <div className="flex flex-row gap-x-2">
                                        <span className="font-bold text-red-600">
                                            ON SALE
                                        </span> 
                                        <span>
                                            {product.price}€
                                        </span>
                                    </div>
                                    : 
                                    <span>{product.price}€</span>
                                    }
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>}
        </div>
    )
}