import RelatedItems from '@/components/product/related-items';
import { ProductData } from '@/components/product/product-data';
import { getProduct, getProducts } from '@/utils/products';
import { Card } from '@/components/ui/card';

interface Params {
    gender: string;
    category: string;
    subcategory: string;
    product: string;
}

async function Product({ params } : { params: Params }) {
    const product: Product = await getProduct(params.product)
    const catalog: Product[] = await getProducts();

    return (
        <div className='m-auto flex flex-col overflow-hidden w-full h-full text-gray-700'>
            {product &&
            <Card className="bg-zinc-200/30 flex flex-col md:flex-row p-4 sm:p-10 w-[95vw] min-h-[600px] sm:w-4/5 cursor-default mt-8 self-center">
                <ProductData id={params.product} />
            </Card>}
            {catalog && product && params.gender && params.category &&
            <RelatedItems catalog={catalog} item={product} gender={params.gender} category={params.category} />}
        </div>
    )
}

export default Product
