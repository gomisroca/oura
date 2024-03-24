import express, { Request, Response } from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface ClothingItem {
    gender: string;
    category: string;
    subcategory: string;
}

interface GenderData {
    [category: string]: string[];
}

router.get('/', async(req: Request, res: Response) => {
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
        
        res.json(result);
    }catch(err: unknown){
        res.status(500).json({message: err})
    }   
})

module.exports = router
