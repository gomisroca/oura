'use client'

import { useState } from 'react';
import ColorMenu from '@/components/product/color-menu';
import Size from '@/components/product/size';
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"

interface Props {
    item: Product;
}

export default function SizeMenu({ item }: Props) {
    const [itemChanged, setItemChanged] = useState(false)
    const [activeSize, setActiveSize] = useState<string>();

    const handleSizeSelection = (size: string) => {
        setActiveSize(size)
        setItemChanged(!itemChanged);
    }
    function checkStock(size): boolean {
        let colors: Color[] | undefined = size.colors;
        if(colors){
            for (const color of colors){
                if (color.amount > 0) {
                    return true
                }
            }
        }
        return false
    }

    return(
        <div className='justify-center flex flex-col text-zinc-700'>
            <div className='justify-center flex flex-row'>
                <ToggleGroup type="single" variant='outline'>
                    {item.sizes.map(size => (
                        checkStock(size) ?
                        <ToggleGroupItem 
                        className='w-[60px] p-0 border border-zinc-300 data-[state=on]:border-zinc-400 text-zinc-700 data-[state=on]:bg-zinc-300 hover:bg-zinc-300 bg-zinc-200' 
                        value={size.size} 
                        key={size.size}> 
                            <Size 
                            item={item} 
                            size={size.size}
                            onSizeSelection={handleSizeSelection} 
                            />
                        </ToggleGroupItem> 
                        :
                        <ToggleGroupItem className='w-[60px] border border-zinc-200 cursor-default hover:bg-transparent data-[state=on]:bg-transparent data-[state=on]:text-unset hover:text-unset text-zinc-400' 
                        value={size.size} 
                        key={size.size}> 
                            {size.size}
                        </ToggleGroupItem> 
                ))}
                </ToggleGroup>
            </div>
            <div className='flex'>
                {activeSize &&
                <ColorMenu item={item} activeSize={activeSize} />}
            </div>
        </div>
        
    )
}