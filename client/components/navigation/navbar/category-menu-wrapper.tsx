'use client'

import { HomepageSettings, NavbarSettings } from "@prisma/client"
import CategoryMenu from "@/components/navigation/navbar/category-menu"
import { useEffect, useState } from "react"
import { CategoryMenuSkeleton } from "@/components/skeletons/category-menu-skeleton"

interface Props {
    navigationSettings: NavbarSettings,
    homepageSettings: HomepageSettings,
    categories: any
}
  
export default function CategoryMenuWrapper({ navigationSettings, homepageSettings, categories }: Props) {
    const [filteredCategories, setFilteredCategories] = useState<Category>();

    function filterCategories(){
        let filteredCategories: Category = {};
        if(categories && navigationSettings){
            navigationSettings?.categories.forEach((category: string) => {
                const cat = category.toLocaleLowerCase();
                if (categories && categories[cat]) {
                    const categoryObject = categories[cat];
                    if (!filteredCategories[cat]) {
                        // If the category key doesn't exist in 'filteredCategories', create it as an array
                        filteredCategories[cat] = categoryObject;
                    } else {
                    // If the category key already exists, push the categoryObject into the array
                        filteredCategories[cat].push(categoryObject);
                    }
                }
            })
        }
        setFilteredCategories(filteredCategories)
    }

    useEffect(() => {
        filterCategories()
    },[])

    return (
        <>
            {navigationSettings && filteredCategories ?
            Object.entries(filteredCategories).map(([gender, categories]) => (
                <CategoryMenu homepageSettings={homepageSettings} key={gender} gender={gender} categories={categories} />
            ))
            : navigationSettings && navigationSettings.categories.length > 0 ?
                <CategoryMenuSkeleton />
            : null}
        </>
    )
}