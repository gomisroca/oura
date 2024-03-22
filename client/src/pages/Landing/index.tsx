import DesktopLayout from "./Desktop"
import MobileLayout from "./Mobile"
import useIsMobile from "../../hooks/useIsMobile";
import { useEffect, useState } from "react";
import axios from "axios";

function Landing() {
    const isMobile = useIsMobile();
    const [categories, setCategories] = useState<Category[]>();

    useEffect(() => {
        axios.get<Category[]>(`${import.meta.env.VITE_REACT_APP_API_URL}/categories`)
        .then((res) => {
            setCategories(res.data);
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
    }, []);
    return (
        categories?
            isMobile ? 
            ( <MobileLayout categories={categories} /> ) 
            : ( <DesktopLayout categories={categories} /> )
        : null
    )
  }
  
  export default Landing