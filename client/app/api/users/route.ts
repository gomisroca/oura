export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyUser } from "@/utils/auth";

export async function GET(req: NextRequest) {
    try{ 
        const user = await verifyUser(req.headers);
        if (user && user.role == 'ADMIN'){
            const users: User[] = await prisma.user.findMany({});
            return NextResponse.json(users, { status: 200 })
        } else{
            return NextResponse.json('NO_AUTH', { status: 403 })
        }
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
};