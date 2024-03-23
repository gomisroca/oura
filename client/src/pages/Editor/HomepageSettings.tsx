import axios from "axios";
import { useEffect, useState } from "react";

interface HomepageSettings {
    id: string;
    categories: string[];
    image: string;
}

export default function HomepageSettings() {
    const [settings, setSettings] = useState<HomepageSettings>();

    const fetchHomepageSettings = async() => {
        await axios.get<HomepageSettings>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/homepage`)
        .then((res) => {
            setSettings(res.data);
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
        fetchHomepageSettings();
    }, []);

    return (
        <>
        </>
    )
}
