import prisma from "@/utils/db";
import { CategorySettings } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const categorySettings: CategorySettings[] | null = await prisma.categorySettings.findMany({});
        if(categorySettings){
            return NextResponse.json(categorySettings, { status: 200 })
        }
        return NextResponse.json('No Settings', { status: 404 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}