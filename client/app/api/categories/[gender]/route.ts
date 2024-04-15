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
        const allCategories: ClothingItem[] = await prisma.product.findMany({
            select: {
                gender: true,
                category: true,
                subcategory: true,
            },
            where: {
                gender: params.gender.toLowerCase()
            },
            distinct: ["category", "subcategory"]
        })

        const result: Record<string, string[]> = allCategories.reduce((acc: Record<string, string[]>, curr) => {
            const { category, subcategory } = curr;
            if (!acc[category.toLowerCase()]) {
                acc[category.toLowerCase()] = [];
            }
            if (!acc[category.toLowerCase()].includes(subcategory.toLowerCase())) {
                acc[category.toLowerCase()].push(subcategory.toLowerCase());
            }
            return acc;
        }, {});
        
        return NextResponse.json(result, { status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}