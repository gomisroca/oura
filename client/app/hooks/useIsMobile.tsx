import {useEffect, useState} from "react";

const useIsMobile = () => {
    const [width, setWidth] = useState<number>(0);

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}

export default useIsMobile