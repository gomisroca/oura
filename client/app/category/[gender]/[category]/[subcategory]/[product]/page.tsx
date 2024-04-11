import FullItemPlaceholder from 'public/images/ph_fullitem.png';
import AddToCart from './AddToCart';
import RelatedItems from './RelatedItems';
import SizeMenu from './SizeMenu';

interface Params {
    gender: string;
    category: string;
    subcategory: string;
    product: string;
}

async function getProduct(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)    
    if(!res.ok){
        throw new Error('Failed to fetch data')
    }

    return res.json();
}

async function getCatalog() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
    if(!res.ok){
        throw new Error('Failed to fetch data')
    }

    return res.json();
}

async function Product({ params } : { params: Params }) {
    const product: Product = await getProduct(params.product)
    const catalog: Product[] = await getCatalog();

    return (
        <div className='flex flex-col overflow-hidden w-full h-full text-gray-700'>
            {product &&
            <div className="flex flex-col md:flex-row p-4 sm:p-10 w-[95vw] sm:w-4/5 cursor-default mt-8 self-center transition duration-200 from-gray-200 to-gray-400/30 hover:from-gray-300 hover:to-gray-400/30 border-zinc-400 hover:border-zinc-500 border-2">
                <div className="overflow-hidden mx-auto h-[400px] sm:h-[600px] w-1/2 bg-white border-2 border-zinc-400 hover:border-zinc-500 transition duration-200 items-center justify-center flex">
                    {product.image ?
                    <img
                    className='mx-auto'
                    src={product.image}
                    alt={product.name}
                    />
                    :
                    <img
                    className='mx-auto'
                    src={FullItemPlaceholder.src}
                    alt={product.name}
                    />}
                </div>
                <div className="md:pl-10 md:w-1/2 mt-2 md:mt-0">
                    <div className="border-zinc-400">
                        {product.sizes.length > 0 ? 
                        <SizeMenu item={product} /> 
                        : 
                        <AddToCart item={product} /> 
                        }
                    </div>
                    <div className="justify-between p-2 flex text-lg font-bold border-t-2 border-zinc-400 md:mt-4 md:pt-4">
                        <div>{product.name}</div>
                        <div>
                            {product.onSale ?
                            <div className="flex gap-x-2">
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
                    <div className="p-2 overflow-clip text-justify">
                        {product.description}
                    </div>
                </div>
            </div>}
            {catalog && product && params.gender && params.category &&
            <RelatedItems catalog={catalog} item={product} gender={params.gender} category={params.category} />}
        </div>
    )
}

export default Product
