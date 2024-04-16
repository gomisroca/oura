'use client'

import {useContext, useEffect, useState} from 'react';
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CartContext from '@/contexts/cart';
interface Props {
    item: Product;
    activeSize: string | undefined;
}

export default function ColorMenu({ item, activeSize }: Props) {
    const [size, setSize] = useState<Size>();
    const { addToCart } = useContext(CartContext);
    const { toast } = useToast()

    useEffect(() => {
        if(activeSize){
            let size: Size | undefined = item.sizes.find(s => s.size === activeSize);
            
            setSize(size);
        }
    }, [item, activeSize])

    return(
        <div className='flex flex-row mx-auto justify-center text-zinc-700'>
            {size ? 
                size.colors.map((color: Color) => (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                            {color.amount > 0 ?
                            <Button
                            onClick={() => {
                                addToCart(item, size, color.name)
                                toast({
                                    description: `Done! Added ${item.name} to your cart`,
                                })
                            }}
                            className={`rounded w-[40px] h-[25px] border-2 border-zinc-400 text-center hover:border-zinc-500 hover:bg-${color.name}-500 my-2 mx-[10px] bg-${color.name}-400`} 
                            ></Button>
                            :
                            <Button
                            key={color.id} 
                            className={`rounded w-[40px] h-[25px] border-2 border-zinc-400 text-center cursor-default my-2 mx-[2px] hover:bg-${color.name}-500 bg-${color.name}-400 opacity-30`} 
                            ></Button>}
                            </TooltipTrigger>
                            <TooltipContent>
                            {color.name.toUpperCase()}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))
                : 
                <span
                className={`w-[35px] h-[25px] my-2 mx-[10px]`} 
                ></span>
            }
        </div>
    )
}