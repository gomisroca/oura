import { useState } from 'react';
import ColorMenu from './ColorMenu';
import Size from './Size';

export default function SizeMenu({ item }) {
    const [itemChanged, setItemChanged] = useState(false)
    const [activeSize, setActiveSize] = useState(null);

    const handleSizeSelection = (size) => {
        item.chosenSize = size;
        setActiveSize(size)
        setItemChanged(!itemChanged);
    }
    
    return(
        <div className='justify-center flex flex-col text-zinc-700'>
            <div className='justify-center flex flex-row'>
                <Size item={item} size={'XS'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
                <Size item={item} size={'S'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
                <Size item={item} size={'M'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
                <Size item={item} size={'L'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
                <Size item={item} size={'XL'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
                <Size item={item} size={'2XL'} activeSize={activeSize} sizeSelection={handleSizeSelection} />
            </div>
            <div className='flex'>
                <ColorMenu item={item} activeSize={activeSize} />
            </div>
        </div>
        
    )
}