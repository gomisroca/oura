'use client';

/**
 * Renders a cart item component.
 *
 * @props
 *  product: The product to be rendered
 *  orderView: Whether the item is in the order view or not, which controls whether the remove button is displayed
 *
 * @example
 * <CartItem product={product} orderView={true} />
 */

import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaTrash } from 'react-icons/fa6';
import { type OrderItem } from 'types';

import { messageAtom } from '@/atoms/message';
import { env } from '@/env';
import { api } from '@/trpc/react';

import Button from '../ui/Button';
import ColorBubble from '../ui/ColorBubble';

function CartItem({
  product,
  orderView = false,
  foldableView = false,
}: {
  product: OrderItem;
  orderView?: boolean;
  foldableView?: boolean;
}) {
  const setMessage = useSetAtom(messageAtom);
  const utils = api.useUtils();

  const handleError = (message: string) => {
    setMessage({ message, error: true, popup: true });
  };

  const handleSuccess = async () => {
    await utils.cart.get.invalidate();
    setMessage({ message: `Added ${product.product.name} to cart`, error: false, popup: true });
  };

  const remove = api.cart.remove.useMutation({
    onSuccess: async () => {
      await handleSuccess();
    },
    onError: (error) => {
      handleError(error.message);
    },
  });

  const removeFromCart = () => {
    remove.mutate({ id: product.id });
  };

  return (
    <div
      key={product.id}
      className={`mx-2 flex flex-row items-center rounded-sm border border-slate-600/10 bg-slate-200/90 xl:bg-slate-200/90 dark:border-slate-400/10 dark:bg-slate-800/90 xl:dark:bg-slate-800/90 ${foldableView ? 'h-[10rem] w-[15rem] md:h-[15rem] md:w-[20rem]' : 'h-[20rem] w-[40rem]'} ${!orderView && product.color.stock <= 0 ? 'border-red-600 dark:border-red-600' : ''}`}>
      <Link
        className="h-full w-1/2 cursor-pointer overflow-y-hidden rounded-l-sm"
        href={`/product/${product.product.id}`}>
        <Image
          unoptimized
          className={`h-full min-h-[10rem] w-full cursor-pointer rounded-l-sm object-cover duration-200 ease-in-out hover:contrast-[1.1] md:min-h-[15rem]`}
          src={
            product.product.image
              ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.product.image}`
              : '/ph_item.png'
          }
          alt={product.product.name}
          width={200}
          height={200}
        />
      </Link>
      <div className="relative flex h-full w-1/2 flex-col items-center justify-center gap-2 p-4 font-semibold">
        <p>{product.product.name}</p>
        <p>{product.price.toFixed(2)}€</p>
        <div className="flex flex-row items-center gap-2">
          {product.size?.name && <p>{product.size.name}</p>}
          {product.color?.name && (
            <ColorBubble clickable={false} color={product.color} product={product.product} sizeId={product.size.id} />
          )}
        </div>
        {product.color.stock <= 0 && <p className="text-red-600">Out of stock</p>}
        {!orderView && (
          <Button
            onClick={() => removeFromCart()}
            className={`h-fit px-[0.75rem] ${foldableView ? 'bottom-4' : 'bottom-8'}`}>
            <FaTrash />
          </Button>
        )}
      </div>
    </div>
  );
}

export default CartItem;
