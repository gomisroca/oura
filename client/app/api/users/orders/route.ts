export const dynamic = 'force-dynamic'

import { verifyUser } from "@/utils/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyUser(req.headers)
        if(user){
            const orders = await prisma.order.findMany({
                where: {
                    userId: user.id
                },
                include:{
                    products: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            return NextResponse.json(orders, { status: 200 })
        } else{
            return NextResponse.json('NO_USER', { status: 401 })
        }
    } catch (err) {
        console.log(err);
    }
}