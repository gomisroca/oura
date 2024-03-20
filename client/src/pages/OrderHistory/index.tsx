import axios from "axios"
import { useEffect, useState } from "react"

import Order from "./Order";

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>();

    const fetchOrders = () => {
        try{
            axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/user/orders`)
            .then(res => {
                console.log(res.data)
                setOrders(res.data)
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
        }catch(err){
            return err
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    if(orders){
        return (
            <div className='flex flex-col overflow-hidden h-full text-zinc-700 border-2 border-zinc-400 mt-10 w-2/3 md:w-2/3'>
                <div className="flex flex-col gap-2">
                    <span className="text-center py-2 text-lg uppercase">Order History</span>
                    {orders.map(order => (
                        <Order order={order} />
                    ))}
                </div>
            </div>
        )
    } else{
        return null;
    }
}
  