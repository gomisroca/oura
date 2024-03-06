import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function AdminProtectedRoute() {
    const { user } = useUser();
    console.log(user)
    return (
        user && user.admin ? 
        <div className="w-full relative flex items-center justify-center">
            <Outlet/> 
        </div>
        : 
        <div className="w-full flex flex-col items-center mt-10">
            <span className='uppercase'>You must be logged in and verified to proceed.</span>
            <span>If you believe you should be allowed access, please contact the site admin.</span>
        </div>
    )
};