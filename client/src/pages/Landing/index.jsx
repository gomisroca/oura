import DesktopLayout from "./Desktop"
import MobileLayout from "./Mobile"
import useIsMobile from "../../hooks/useIsMobile";

function Landing() {
    const isMobile = useIsMobile();
    
    return (
        isMobile ? ( <MobileLayout /> ) : ( <DesktopLayout /> )
    )
  }
  
  export default Landing