import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export default function EditorDashboard() {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col items-center gap-2 mt-5">
                {user?.role !== 'BASIC' &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Products</span>
                    <div className="flex gap-2">
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('products')}>
                            Product List
                        </div>
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('products/upload')}>
                            Add Product
                        </div>
                    </div>
                </div>}
                {(user?.role == 'SUPER' || user?.role == 'ADMIN') &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Display Settings</span>
                    <div className="flex gap-2">
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('categories')}>
                            Categories
                        </div>
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('navigation')}>
                            Navigation
                        </div>
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('homepage')}>
                            Homepage
                        </div>
                    </div>
                </div>}
                {user?.role == 'ADMIN' &&
                <div className="w-[500px] border border-zinc-400 flex flex-col items-center p-4 gap-2 hover:border-zinc-500">
                    <span className="uppercase">Users</span>
                    <div className="flex gap-2">
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('users/upload')}>
                            Add User
                        </div>
                        <div 
                        className='text-center uppercase cursor-pointer font-semibold border-2 p-2 border-zinc-400 hover:border-zinc-500 rounded hover:bg-gradient-to-br hover:from-zinc-200 hover:to-zinc-300' 
                        onClick={() => navigate('users')}>
                            Edit User
                        </div>
                    </div>
                </div>}
            </div>
        </>
    )
}
