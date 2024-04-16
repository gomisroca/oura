import UserWrapper from "@/components/navigation/navbar/user-wrapper";
import CategoryMenuWrapper from "@/components/navigation/navbar/category-menu-wrapper"
import Link from "next/link";
import { Urbanist } from 'next/font/google'
import { getHomepageSettings, getNavigationSettings } from "@/utils/settings";
import { NavbarSettings } from "@prisma/client";
import { getCategories } from "@/utils/categories";
 
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
        <div className={urbanist.className + " sticky flex flex-row w-full bg-zinc-200 text-zinc-700 drop-shadow"}>
            <Link 
            className="px-2 font-semibold subpixel-antialiased text-[0.9rem] md:text-[1.2rem] hover:text-zinc-800 cursor-pointer"
            href={'/'}>
                OURA
            </Link>
            {navigationSettings && homepageSettings && categories &&
            <div className="my-auto flex flex-row items-center">
                <CategoryMenuWrapper navigationSettings={navigationSettings} homepageSettings={homepageSettings} categories={categories} />
            </div>}
            <div className="absolute right-0 self-center">
                <UserWrapper />
            </div>
        </div>
        </>
    );
}