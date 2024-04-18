import Link from "next/link";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
} from "@/components/ui/menubar"
import { Separator } from "@/components/ui/separator";
import { HomepageSettings } from "@prisma/client";

interface Props {
    homepageSettings: HomepageSettings
    gender: string;
    categories: Category;
}

export default function CategoryMenu({ homepageSettings, gender, categories }: Props) {
    return (
        <>
        <Menubar className="h-full">
            <MenubarMenu>
                <MenubarTrigger className="hover:bg-zinc-100/30 h-full"> 
                    {gender}
                </MenubarTrigger>
                <MenubarContent>
                    {homepageSettings?.sale &&
                    <Link 
                    href={`/category/${gender.toLowerCase()}/season`}>
                        <MenubarItem 
                        style={{backgroundImage: `url(${homepageSettings.saleImage})`}} 
                        className="border text-lg p-0 rounded-t-md">
                            <div className="rounded-t-md font-semibold py-2 px-1 w-full bg-gradient-to-br text-zinc-200 hover:text-zinc-100  from-zinc-600 via-zinc-400/20 to-zinc-300/10  hover:from-zinc-600 hover:via-zinc-400/10">
                                {homepageSettings.saleText}
                            </div>
                        </MenubarItem>
                    </Link>}
                    <Separator />
                    <Link 
                    href={`/category/${gender.toLowerCase()}`}>
                        <MenubarItem>All</MenubarItem>
                    </Link>
                    {categories && 
                    Object.entries(categories).map(subcategory => (
                    <MenubarSub key={subcategory[0]}>
                        <MenubarSeparator />
                        <MenubarSubTrigger>{subcategory[0]}</MenubarSubTrigger>
                        <MenubarSubContent>
                            <Link href={`/category/${gender.toLowerCase()}/${subcategory[0].toLowerCase()}`}> 
                                <MenubarItem>All</MenubarItem>
                            </Link>
                            {subcategory[1].map((sub: string) => (
                                <Link key={sub} 
                                href={`/category/${gender.toLowerCase()}/${subcategory[0].toLowerCase()}/${sub.toLowerCase()}`}>
                                    <MenubarSeparator />
                                    <MenubarItem>{sub}</MenubarItem>
                                </Link>
                            ))}
                        </MenubarSubContent>
                    </MenubarSub>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
        </>
    );
}