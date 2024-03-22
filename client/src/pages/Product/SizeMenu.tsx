import { useState } from 'react';
import ColorMenu from './ColorMenu';
import Size from './Size';

interface Props {
    item: CartProduct;
}

export default function SizeMenu({ item }: Props) {
    const [itemChanged, setItemChanged] = useState(false)
    const [activeSize, setActiveSize] = useState<string | null>(null);

    const handleSizeSelection = (size: string) => {
        item.size = size;
        console.log(size)
        setActiveSize(size)
        setItemChanged(!itemChanged);
    }
    
    return(
        <div className='justify-center flex flex-col text-zinc-700'>
            <div className='justify-center flex flex-row'>
                <Size item={item} size={'XS'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
                <Size item={item} size={'S'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
                <Size item={item} size={'M'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
                <Size item={item} size={'L'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
                <Size item={item} size={'XL'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
                <Size item={item} size={'2XL'} activeSize={activeSize} onSizeSelection={handleSizeSelection} />
            </div>
            <div className='flex'>
                <ColorMenu item={item} activeSize={activeSize} />
            </div>
        </div>
        
    )
}