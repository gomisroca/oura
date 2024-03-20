import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function AdminProtectedRoute() {
    const navigate = useNavigate();
    const { user } = useUser();
    if (user && user.admin){
        return (
            <>
            <div className="w-full relative flex items-center justify-center">
                <Outlet/> 
            </div>
            </>
        )
    } else{
        return(
            <>
            <div className="w-full flex flex-col items-center mt-10">
                <span className='uppercase'>You must be logged in and verified to proceed.</span>
                <span>If you believe you should be allowed access, please contact the site admin.</span>
                <div 
                onClick={() => navigate('/')}
                className='mt-5 px-5 py-2 uppercase w-full block text-center cursor-pointer border border-zinc-400 hover:bg-zinc-300'>
                    Go Back
                </div>
            </div>
            </>
        )
    }
};