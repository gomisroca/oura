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
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger> 
                    {gender}
                </MenubarTrigger>
                <MenubarContent>
                    {homepageSettings?.sale &&
                    <Link 
                    href={`/category/${gender.toLowerCase()}/season`}>
                        <MenubarItem className="bg-red-300 hover:bg-red-400 border font-bolder text-md">
                            {homepageSettings.saleText}
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