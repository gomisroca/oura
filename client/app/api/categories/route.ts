import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface ClothingItem {
    gender: string;
    category: string;
    subcategory: string;
}
interface GenderData {
    [category: string]: string[];
}

export async function GET(req: NextRequest) {
    try{
        const allCategories: ClothingItem[] = await prisma.product.findMany({
            select: {
                gender: true,
                category: true,
                subcategory: true,
            },
            distinct: ["gender", "category", "subcategory"]
        })

        const result: Record<string, GenderData> = allCategories.reduce((acc: Record<string, GenderData>, curr) => {
            const { gender, category, subcategory } = curr;
            if (!acc[gender.toLowerCase()]) {
                acc[gender.toLowerCase()] = {};
            }
            if (!acc[gender.toLowerCase()][category.toLowerCase()]) {
                acc[gender.toLowerCase()][category.toLowerCase()] = [];
            }
            if (!acc[gender.toLowerCase()][category.toLowerCase()].includes(subcategory.toLowerCase())) {
                acc[gender.toLowerCase()][category.toLowerCase()].push(subcategory.toLowerCase());
            }
            return acc;
        }, {});
        
        return NextResponse.json(result, { status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}