import UserWrapper from "@/components/navigation/navbar/user-wrapper";
import CategoryMenuWrapper from "@/components/navigation/navbar/category-menu-wrapper"
import Link from "next/link";
import { Urbanist } from 'next/font/google'
import { getHomepageSettings, getNavigationSettings } from "@/utils/settings";
import { NavbarSettings } from "@prisma/client";
import { getCategories } from "@/utils/categories";
import { Card } from "../ui/card";
 
const urbanist = Urbanist({
    subsets: ['latin'],
    display: 'swap',
    weight: '600'
})

export default async function Navbar() {
    const navigationSettings: NavbarSettings | null  = await getNavigationSettings();
    const homepageSettings: HomepageSettings | null = await getHomepageSettings();
    const categories: Category | null = await getCategories();
    
    return (
        <>
        <Card className={urbanist.className + " bg-gradient-to-r from-zinc-400/60 via-transparent to-zinc-400/60 sticky flex flex-row m-2 text-zinc-100 hover:from-unset hover:to-unset hover:border-zinc-100"}>
            <Link 
            className="px-2 font-semibold subpixel-antialiased text-[0.9rem] md:text-[1.2rem] hover:text-zinc-100 hover:bg-zinc-100/30 drop-shadow-md cursor-pointer"
            href={'/'}>
                OURA
            </Link>
            {navigationSettings && homepageSettings && categories &&
            <div className="flex flex-row items-center">
                <CategoryMenuWrapper navigationSettings={navigationSettings} homepageSettings={homepageSettings} categories={categories} />
            </div>}
            <div className="absolute flex flex-row right-0 h-full items-center">
                <UserWrapper />
            </div>
        </Card>
        </>
    );
}