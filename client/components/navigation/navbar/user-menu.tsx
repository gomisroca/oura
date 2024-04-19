import * as React from 'react';

import { useUser } from '@/contexts/user';
import LoginForm from '@/components/navigation/navbar/login-form';
import RegisterForm from '@/components/navigation/navbar/register-form';
import UserSettings from '@/components/navigation/navbar/user-settings';
import Link from 'next/link';
import { Menubar, MenubarTrigger, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator } from '@/components/ui/menubar';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MenuIcon } from 'lucide-react';

export default function UserMenu() {
    const { user, userLogout } = useUser();

    return (
        <>
        <Menubar>
            {user ?
                <MenubarMenu>
                    <MenubarTrigger className='text-shadow h-full md:px-4 hover:bg-zinc-100/30 text-lg'>
                        {user.firstName.toUpperCase()}
                    </MenubarTrigger>
                    <MenubarContent>
                            <Sheet>
                                <SheetTrigger 
                                className='w-full relative flex cursor-pointer uppercase hover:bg-zinc-300 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                    Settings
                                </SheetTrigger>
                                <SheetContent>
                                    <UserSettings />
                                </SheetContent>
                            </Sheet>
                        <MenubarSeparator />
                        <Link href={`/order-history`}>
                            <MenubarItem>Your Orders</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <Link href={`/editor`}>
                           <MenubarItem className='hover:bg-violet-300'>🔒 Dashboard</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <MenubarItem 
                        className='hover:bg-red-500'
                        onClick={() => { userLogout() }}>Logout</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            :   
                <MenubarMenu>
                    <MenubarTrigger className='drop-shadow-[1px_1px_5px_black] hover:drop-shadow-none h-full md:px-4 hover:bg-zinc-100/30'>
                        <MenuIcon />
                    </MenubarTrigger>
                    <MenubarContent>
                        <Sheet>
                            <SheetTrigger 
                            className='w-full relative flex cursor-pointer uppercase hover:bg-zinc-300 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                Sign In
                            </SheetTrigger>
                            <SheetContent>
                                <LoginForm />
                            </SheetContent>
                        </Sheet>
                        <MenubarSeparator />
                        <Sheet>
                            <SheetTrigger 
                            className='w-full relative flex cursor-pointer uppercase hover:bg-zinc-300 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                Register
                            </SheetTrigger>
                            <SheetContent>
                                <RegisterForm />
                            </SheetContent>
                        </Sheet>
                    </MenubarContent>
                </MenubarMenu>
            }
        </Menubar>
        </>
    )
}