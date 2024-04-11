'use client'

import Cart from './Cart';
import Account from './Account';

export default function UserMenu() {
    return (
        <div className='flex flex-row items-center px-2'>
            <Cart />
            <Account />
        </div>
    )
}