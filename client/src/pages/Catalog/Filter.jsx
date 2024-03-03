import { useEffect, useState } from 'react';

export default function Filter({ products, updateProducts }) {
    const sizes = ['XS','S','M','L','XL','XXL'];
    const [sizeFilter, setSizeFilter] = useState(null);

    const filterProducts = () => {
        if(sizeFilter == null || sizeFilter == ''){
            updateProducts(products);
        }
        else{
            let filteredProducts = products.filter(item => {
                if (sizeFilter && item.sizes) {
                    for(let i = 0; item.sizes[sizeFilter].length; i++){
                        if(item.sizes[sizeFilter][i]){
                        if(item.sizes[sizeFilter][i].amount > 0){
                            return true;
                        }
                        } else{
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
        <div className='bg-zinc-200 w-fit border-b border-zinc-400'>
            <span className='border-r border-zinc-400 px-4 py-2 cursor-default'>Size</span>
            <select
            className='bg-zinc-200 hover:bg-zinc-300 px-4 py-2 cursor-pointer font-semibold'
            value={sizeFilter}
            onChange={e => setSizeFilter(e.target.value)}>
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