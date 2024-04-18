import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface ClothingItem {
    gender: string[];
    category: string[];
    subcategory: string[];
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
            for(const gen of gender){
                if (!acc[gen.toLowerCase()]) {
                    acc[gen.toLowerCase()] = {};
                }
                for(const cat of category){
                    if (!acc[gen.toLowerCase()][cat.toLowerCase()]) {
                        acc[gen.toLowerCase()][cat.toLowerCase()] = [];
                    }
                    for(const sub of subcategory){
                        if (!acc[gen.toLowerCase()][cat.toLowerCase()].includes(sub.toLowerCase())) {
                            acc[gen.toLowerCase()][cat.toLowerCase()].push(sub.toLowerCase());
                        }
                    }
                }
            }
            return acc;
        }, {});
        console.log(result)
        return NextResponse.json(result, { status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}

export async function POST(
    req: NextRequest
) {
    try{
        const gender = await req.text();
        console.log(gender)
        const allCategories: any = await prisma.product.findMany({
            select: {
                gender: true,
                category: true,
                subcategory: true,
            },
            where: {
                gender: { has: gender.toLowerCase()}
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
        console.log(result)
        return NextResponse.json(result, { status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}