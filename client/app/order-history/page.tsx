import { cookies } from "next/headers";
import Order from "@/components/shop/order";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getData(){
    try{
        const nextCookies = cookies();
        const accessToken = nextCookies.get('oura__access_token__')
        if(accessToken){
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/orders`, {
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
        <Card className='m-auto flex flex-col overflow-hidden w-2/3 gap-2 p-2 min-h-[600px]'>
            <span className="text-center text-lg uppercase">Order History</span>
            <Separator />
            {orders && orders.length > 0 ? 
            orders.map((order: Order) => (
                <div key={order.id}>
                    <Order order={order} />
                </div>
            ))
            : 
            <div className="pb-2 m-auto"> There is nothing here yet.</div>}
        </Card>
    )
}
  