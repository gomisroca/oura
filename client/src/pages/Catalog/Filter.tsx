import { ChangeEvent, useEffect, useState } from 'react';

interface Props {
    products: Clothes[];
    updateProducts: (products: Clothes[]) => void;
}

export default function Filter({ products, updateProducts }: Props) {
    const sizes: string[] = ['XS','S','M','L','XL','XXL'];
    const [sizeFilter, setSizeFilter] = useState<string>('');

    const filterProducts = () => {
        if(sizeFilter == ''){
            updateProducts(products);
        }
        else{
            let filteredProducts = products.filter(item => {
                if (sizeFilter && item.sizes) {
                    let chosenSize: Size | undefined = item.sizes.find(s => s.size === sizeFilter);
                    for(let i = 0; chosenSize?.colors.length; i++){
                        let color: Color = chosenSize.colors[i] as Color;
                        if(color && color.amount > 0){
                            return true;
                        }else{
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            });

            updateProducts(filteredProducts);
        }
    }

    useEffect(() => {
        if(products){
            filterProducts();
        }
    }, [sizeFilter])

    useEffect(() => {
        setSizeFilter('')
    }, [products])
   

    return (
        <div className='bg-zinc-200 w-fit border-b border-zinc-400 z-50 m-auto'>
            <span className='border-r border-zinc-400 px-4 py-2 cursor-default'>Size</span>
            <select
            className='bg-zinc-200 hover:bg-zinc-300 px-4 py-2 cursor-pointer font-semibold'
            value={sizeFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSizeFilter(e.target.value)}>
                <option
                value=''>
                    All
                </option>
                <hr />
                {sizes.map((size) => (
                    <option
                    key={size}
                    value={size}>
                        {size}
                    </option>
                ))}
            </select>
        </div>
    );
};