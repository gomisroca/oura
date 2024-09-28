'use client';

import { api } from '@/trpc/react';
import Button from '../_components/ui/Button';

const mockItems = [
  {
    name: 'White T-Shirt',
    price: 20.99,
    productId: '600fb1ad-e1b3-410b-84b8-3a8c3b95bd94',
    sizeId: 'cm1bzye1q00085moxpiv6ynd3',
    colorId: 'cm1bzye88000a5moxl44gr2ny',
  },
  {
    name: 'Black T-Shirt',
    price: 17.99,
    productId: '600fb1ad-e1b3-410b-84b8-3a8c3b95bd94',
    sizeId: 'cm1bzye1q00085moxpiv6ynd3',
    colorId: 'cm1bzye88000a5moxl44gr2ny',
  },
];

function MockAddToCart() {
  const utils = api.useUtils();
  const addToCart = api.cart.add.useMutation({
    onSuccess: async () => {
      await utils.cart.get.invalidate();
    },
  });

  const handleAddToCart = async (item: {
    name: string;
    price: number;
    productId: string;
    sizeId: string;
    colorId: string;
  }) => {
    await addToCart.mutateAsync({
      name: item.name,
      price: item.price,
      productId: item.productId,
      sizeId: item.sizeId,
      colorId: item.colorId,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {mockItems.map((item) => (
        <Button key={item.name + item.colorId} onClick={() => handleAddToCart(item)}>
          Add {item.name} to cart
        </Button>
      ))}
    </div>
  );
}

export default MockAddToCart;
