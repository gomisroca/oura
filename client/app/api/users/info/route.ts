import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/auth";

export async function GET(req: NextRequest) {
    try {
        const user = verifyUser(req.headers);
        if (user){
            return NextResponse.json(user, { status: 200 });
        }else{
            return NextResponse.json("NO_TOKEN", { status: 403 })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json("UNCAUGHT_ERROR", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}