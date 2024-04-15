import { cookies } from "next/headers";
import Order from "@/components/shop/order";

async function getData(){
    try{
        const nextCookies = cookies();
        const accessToken = nextCookies.get('oura__access_token__')
        if(accessToken){
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken.value}`
                }
            });
            if(!res.ok){
                return null
            }
            return res.json();
        }
        return null
    }catch(err){
        return err
    }
}

export default async function OrderHistory() {
    const orders = await getData();
    
    return (
        <div className='flex flex-col overflow-hidden h-full text-zinc-700 border-2 border-zinc-400 mt-10 w-2/3 md:w-2/3'>
            <div className="flex flex-col gap-2">
                <span className="text-center py-2 text-lg uppercase border-b border-zinc-400">Order History</span>
                {orders && orders.length > 0 ? 
                orders.map((order: Order) => (
                    <div key={order.id}>
                        <Order order={order} />
                    </div>
                ))
                : 
                <div className="pb-2 m-auto"> There is nothing here yet.</div>}
            </div>
        </div>
    )
}
  