import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Error from "../Error";

export default function CatalogFilteredRoute() {
    const gender = useParams().gender;
    const category = useParams().category;
    const subcategory = useParams().subcategory;

    const [canPass, setCanPass] = useState<boolean>(false);

    const fetchCatalog = () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories`)
        .then((res) => {
            
            const dataArray = Object.entries(res.data);

            let genderArray: string[] = [];
            let categoryArray: string[] = [];
            let subcategoryArray: string[] = [];

            for(const [gender, categories] of dataArray){
                if (!genderArray.includes(gender.toLowerCase())){
                    genderArray.push(gender.toLowerCase());
                }
                const categoriesArray = Object.entries(categories as Record<string, any>);
                for(const [category, subcategories] of categoriesArray){
                    if (!categoryArray.includes(category.toLowerCase())){
                        categoryArray.push(category.toLowerCase());
                    }
                    for(const subcategory of subcategories){
                        if (!subcategoryArray.includes(subcategory.toLowerCase())){
                            subcategoryArray.push(subcategory.toLowerCase())
                        }
                    }
                }
            }

            categoryArray.push('season');
            if(subcategory && category && gender && subcategoryArray.includes(subcategory) && categoryArray.includes(category) && genderArray.includes(gender)){
                setCanPass(true)
            }else if(!subcategory && category && gender && categoryArray.includes(category) && genderArray.includes(gender)){
                setCanPass(true)
            }else if(!subcategory && !category && gender && genderArray.includes(gender)){
                setCanPass(true)
            }
            else{
                setCanPass(false)
            }
        })
        .catch(error => {
            if(error.response){
                console.log(error.response)
            } else if(error.request){
                console.log(error.request)
            } else{
                console.log(error.message)
            }
        })
    }
    useEffect(() => {
        fetchCatalog();
    }, [gender, category, subcategory])

    if(canPass){
        return (
            <>
            <div className="w-full relative flex items-center justify-center">
                <Outlet/> 
            </div>
            </>
        )
    }
    else{
        return(
            <>
            <Error />
            </>
        )
    }
};