import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserEdit() {
    const [user, setUser] = useState<User>();
    const id = useParams().id;

    useEffect(() => {
        axios.get<User>(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${id}`)
        .then(res => {
            setUser(res.data)
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
    }, [id])
    
    return (
        <>
        {user &&
        <div 
        key={user.id} 
        className="w-[250px] flex flex-col border border-zinc-400 mt-5 p-4">
            <span className="border-b border-zinc-400 p-2">{user.firstName} {user.lastName}</span>
            <div className="flex flex-col p-2">
                <span>{user.email}</span>
                <span>{user.role}</span>
            </div>
        </div>}
        </>
    )
}
