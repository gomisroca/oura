'use client'

import { useContext } from 'react';
import CartContext from '@/contexts/cart';
import { ShoppingCart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';

interface Props {
    item: Product;
}

export default function AddToCart({ item }: Props) {
    const { addToCart } = useContext(CartContext);
    const { toast } = useToast();

    return(
        <div className='flex flex-row mx-auto justify-end text-zinc-700'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <ShoppingCart  
                        onClick={() => { 
                        addToCart(item);  
                        toast({
                            description: `Done! Added ${item.name} to your cart`,
                        })}} />
                    </TooltipTrigger>
                    <TooltipContent>
                        Add to Cart
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}