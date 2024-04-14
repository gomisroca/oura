import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try{ 
        const user = verifyUser(req.headers);
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