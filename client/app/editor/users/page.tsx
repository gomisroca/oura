import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function UserEditList() {
    const navigate = useNavigate();
    const { user } = useUser();
    if (user && user.role !== 'ADMIN'){
        navigate('/')
    }
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/users/`)
        .then(res => {
            setUsers(res.data)
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
    }, [])
    
    return (
        <div className="flex flex-col gap-2 mt-5">
        {users &&
        users.map((user: User) => (
            <div 
            onClick={() => navigate(user.id)}
            key={user.id} 
            className="w-[250px] flex flex-col border border-zinc-400 hover:border-zinc-500 bg-zinc-200 hover:bg-zinc-300 p-4 cursor-pointer">
                <span className="border-b border-zinc-400 p-2">{user.firstName} {user.lastName}</span>
                <div className="flex flex-col p-2">
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                </div>
            </div>
        ))}
        </div>
    )
}
