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

import Image from 'next/image';
import React from 'react';
import { type OrderItem } from 'types';
import ColorBubble from '../ui/ColorBubble';
import { env } from '@/env';
import Button from '../ui/Button';
import { api } from '@/trpc/react';
import { FaTrash } from 'react-icons/fa6';

function CartItem({
  product,
  orderView,
  handleUpdateCart,
}: {
  product: OrderItem;
  orderView?: boolean;
  handleUpdateCart?: () => void;
}) {
  const remove = api.cart.remove.useMutation({
    onSuccess: () => {
      handleUpdateCart?.();
    },
  });

  const removeFromCart = () => {
    remove.mutate({ id: product.id });
  };

  return (
    <div key={product.id} className="flex flex-row gap-2 rounded-lg border p-5">
      <Image
        src={
          product.product.image
            ? `https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.product.image}`
            : '/ph_item.png'
        }
        className="rounded-lg"
        alt={product.product.name}
        width={200}
        height={200}
      />
      <div className="flex flex-row items-start gap-4">
        <div className="flex flex-col gap-2">
          <p>{product.product.name}</p>
          <p>${product.price.toFixed(2)}</p>
          <div className="flex flex-row items-center gap-2">
            {product.size?.name && <p>{product.size.name}</p>}
            {product.color?.name && <ColorBubble color={product.color.name} />}
          </div>
        </div>
        {!orderView && (
          <Button onClick={() => removeFromCart()} className="h-fit px-[0.75rem]">
            <FaTrash />
          </Button>
        )}
      </div>
    </div>
  );
}

export default CartItem;
