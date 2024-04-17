import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface ClothingItem {
    gender: string;
    category: string;
    subcategory: string;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { gender: string } }
) {
    try{
        const allCategories: any = await prisma.product.findMany({
            select: {
                gender: true,
                category: true,
                subcategory: true,
            },
            where: {
                gender: { has: params.gender.toLowerCase()}
            },
            distinct: ["category", "subcategory"]
        })

        const result: Record<string, string[]> = allCategories.reduce((acc: Record<string, string[]>, curr) => {
            const { category, subcategory } = curr;
            for(const cat of category){
                if (!acc[cat.toLowerCase()]) {
                    acc[cat.toLowerCase()] = [];
                }
                for(const sub of subcategory){
                    if (!acc[cat.toLowerCase()].includes(sub.toLowerCase())) {
                        acc[cat.toLowerCase()].push(sub.toLowerCase());
                    }
                }
            }
            console.log(acc)
            return acc;
        }, {});
        
        return NextResponse.json(result, { status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}