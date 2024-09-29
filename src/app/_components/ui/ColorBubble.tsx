'use client';

import { api } from '@/trpc/react';
import { Color, Product } from '@prisma/client';
import { ProductWithSizes } from 'types';
import { useMessage } from '@/context/MessageContext';

function ColorBubble({ clickable = true, product, sizeId, color }: { clickable?: boolean, product: ProductWithSizes | Product, sizeId: string, color: Color }) {
  const { setMessage, setError, setPopup } = useMessage();
  const utils = api.useUtils();
  const addToCart = api.cart.add.useMutation({
    onSuccess: async () => {
      await utils.cart.get.invalidate();
    },
  });

  const handleAddToCart = async (product: ProductWithSizes | Product, sizeId: string, colorId: string) => {
    try {
      await addToCart.mutateAsync({
        name: product.name,
        price: product.basePrice,
        productId: product.id,
        sizeId: sizeId,
        colorId: colorId,
      });
    } catch (_error) {
      setMessage('Please sign in to add to cart');
      setError(true);
      setPopup(true);
    }
  };

  return (
    <>
      <span 
      onClick={() => color.stock && clickable ? handleAddToCart(product, sizeId, color.id) : null}
      className={`h-4 w-4 rounded-full border border-slate-800 shadow-md transition duration-200 ease-in-out dark:border-slate-200 
        ${color.name === 'black' ? 'bg-black' : color.name === 'white' ? 'bg-white' : `bg-${color.name}-500`} 
        ${color.stock === 0 ? 'cursor-auto opacity-30' : color.stock ? 'cursor-pointer opacity-100 hover:brightness-[1.25]' : ''}`}>
      </span>
    </>
  )
}

export default ColorBubble