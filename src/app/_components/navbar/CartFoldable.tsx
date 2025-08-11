import React from 'react';
import { FaCartShopping } from 'react-icons/fa6';

import { getServerAuthSession } from '@/server/auth';

import CartList from '../cart/CartList';
import Foldable from '../ui/Foldable';

async function CartFoldable() {
  const session = await getServerAuthSession();
  if (!session) return;
  return (
    <Foldable
      button={{ name: 'Cart', text: <FaCartShopping size={20} />, className: 'px-3' }}
      className="w-max"
      addCaret={false}>
      <CartList foldableView={true} />
    </Foldable>
  );
}

export default CartFoldable;
