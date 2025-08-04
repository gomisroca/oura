'use client';

import { api } from '@/trpc/react';
import { Color, Product } from 'generated/prisma';
import { ProductWithSizes } from 'types';
import { useSetAtom } from 'jotai';
import { messageAtom } from "@/atoms/message";

function ColorBubble({ clickable = true, product, sizeId, color }: { clickable?: boolean, product: ProductWithSizes | Product, sizeId: string, color: Color }) {
  const setMessage = useSetAtom(messageAtom);
  const utils = api.useUtils();
  const addToCart = api.cart.add.useMutation({
    onSuccess: async () => {
      await utils.cart.get.invalidate();
    },
  });

  const handleAddToCart = async (product: ProductWithSizes, sizeId: string, colorId: string) => {
    try {
      const price = product.sales && product.sales.length > 0 ? product.onSalePrice : product.basePrice;
      await addToCart.mutateAsync({
        name: product.name,
        price: price,
        productId: product.id,
        sizeId: sizeId,
        colorId: colorId,
      }).then(() => {
        setMessage({ message: `Added ${product.name} to cart`, error: false, popup: true});
      });
    } catch (_error) {
      setMessage({ message: 'Please sign in to add to cart', error: true, popup: true});
    }
  };

  return (
    <>
      <span 
      onClick={() => color.stock && clickable ? handleAddToCart(product as ProductWithSizes, sizeId, color.id) : null}
      className={`h-4 w-4 rounded-sm border border-slate-800 shadow-md transition duration-200 ease-in-out dark:border-slate-200 
        ${color.name === 'black' ? 'bg-black' : color.name === 'white' ? 'bg-white' : `bg-${color.name}-500`} 
        ${!clickable ? 'cursor-default' : color.stock ? 'cursor-pointer opacity-100 hover:brightness-[1.25]' : color.stock === 0 ? 'cursor-default opacity-30' : ''}`}>
      </span>
    </>
  )
}

export default ColorBubble