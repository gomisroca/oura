import React from 'react';
import Foldable from '../ui/Foldable';
import { FaCartShopping } from 'react-icons/fa6';
import CartList from '../cart/CartList';

async function CartFoldable() {
  return (
    <Foldable
      button={{ name: 'Cart', text: <FaCartShopping size={20} />, className: 'px-[0.75rem] xl:px-10' }}
      className="w-max"
      addCaret={false}>
      <CartList foldableView={true} />
    </Foldable>
  );
}

export default CartFoldable;
