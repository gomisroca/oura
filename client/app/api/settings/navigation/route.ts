import prisma from "@/utils/db";
import { NavbarSettings } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const settings: NavbarSettings[] = await prisma.navbarSettings.findMany({});
        if(settings[0]){
            return NextResponse.json(settings[0], { status: 200 })
        }
        return NextResponse.json('No Settings', { status: 404 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}

export async function POST(req: NextRequest) {
    try{
        const categories: string[] = await req.json();
        const settings: NavbarSettings[] = await prisma.navbarSettings.findMany({});
        if(settings[0]){
            await prisma.navbarSettings.update({
                where: {
                    id: settings[0].id
                },
                data:{
                    categories: categories,
                }
            })
        } else{
            await prisma.navbarSettings.create({
                data: {
                    categories: categories,
                }
            })
        }
        return NextResponse.json({ status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}