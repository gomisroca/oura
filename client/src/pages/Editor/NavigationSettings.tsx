import axios from "axios";
import { useEffect, useState } from "react";

interface NavigationSettings {
    id: string;
    categories: string[];
}

export default function NavigationSettings() {
    const [settings, setSettings] = useState<NavigationSettings>();

    const fetchNavigationSettings = async() => {
        await axios.get<NavigationSettings>(`${import.meta.env.VITE_REACT_APP_API_URL}/settings/navigation`)
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
        fetchNavigationSettings();
    }, []);
    return (
        <>
        </>
    )
}
