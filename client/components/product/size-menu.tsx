'use client'

import { useState } from 'react';
import ColorMenu from '@/components/product/color-menu';
import Size from '@/components/product/size';

interface Props {
    item: Product;
}

export default function SizeMenu({ item }: Props) {
    const [itemChanged, setItemChanged] = useState(false)
    const [activeSize, setActiveSize] = useState<string | null>(null);

    const handleSizeSelection = (size: string) => {
        setActiveSize(size)
        setItemChanged(!itemChanged);
    }
    
    return(
        <div className='justify-center flex flex-col text-zinc-700'>
            <div className='justify-center flex flex-row'>
                {item.sizes.map(size => (
                    <Size 
                    key={size.size} 
                    item={item} 
                    size={size.size} 
                    activeSize={activeSize} 
                    onSizeSelection={handleSizeSelection} 
                    />
                ))}
                
            </div>
            <div className='flex'>
                <ColorMenu item={item} activeSize={activeSize} />
            </div>
        </div>
        
    )
}