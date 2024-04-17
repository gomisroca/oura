'use client'

import Cart from '@/components/navigation/navbar/cart';
import UserMenu from '@/components/navigation/navbar/user-menu';

export default function UserWrapper() {
    return (
        <div className='flex flex-row h-full'>
            <Cart />
            <UserMenu />
        </div>
    )
}