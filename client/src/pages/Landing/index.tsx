import DesktopLayout from "./Desktop"
import MobileLayout from "./Mobile"
import useIsMobile from "../../hooks/useIsMobile";
import { useEffect, useState } from "react";
import axios from "axios";

function Landing() {
    const isMobile = useIsMobile();
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
        settings ?
            isMobile ? 
            ( <MobileLayout settings={settings} /> ) 
            : 
            ( <DesktopLayout settings={settings} /> )
        : null
    )
  }
  
  export default Landing