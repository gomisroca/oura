import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import Error from "../Error";

export default function CatalogFilteredRoute() {
    const genre = useParams().genre;
    const category = useParams().category;
    const type = useParams().type;

    const [canPass, setCanPass] = useState(false);

    const fetchCatalog = () => {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories/catalog`)
        .then((res) => {
            const categories = res.data;
            let genreArray = [];
            let classArray = [];
            let typeArray = [];

            for(const category of categories){
                if (!genreArray.includes(category.genre.toLowerCase())){
                    genreArray.push(category.genre.toLowerCase())
                }
                for(const categoryClass of category.classes){
                    if (!classArray.includes(categoryClass.name.toLowerCase())){
                        classArray.push(categoryClass.name.toLowerCase())
                    }
                    for(const classType of categoryClass.types){
                        if (!typeArray.includes(classType.toLowerCase())){
                            typeArray.push(classType.toLowerCase())
                        }
                    }
                }
            }

            classArray.push('season');
            if(type && category && genre && typeArray.includes(type) && classArray.includes(category) && genreArray.includes(genre)){
                setCanPass(true)
            }else if(!type && category && genre && classArray.includes(category) && genreArray.includes(genre)){
                setCanPass(true)
            }else if(!type && !category && genre && genreArray.includes(genre)){
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
    }, [genre, category, type])

    return (
        canPass ? 
        <div className="w-full relative flex items-center justify-center">
            <Outlet/> 
        </div>
        : 
        <Error />
    )
};