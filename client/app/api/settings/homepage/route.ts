import prisma from "@/utils/db";
import fs from 'fs';
import { handleImageUpload } from "@/utils/image-upload";
import { HomepageSettings } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const settings: HomepageSettings[] = await prisma.homepageSettings.findMany({});
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
        const formData = await req.formData();
        const sale = formData.get('sale');
        const saleText = formData.get('saleText') as string;
        const categoriesString: string = formData.get('categories') as string;
        const categories: string[] = categoriesString.split(',')
        categories.forEach((category: string) => (
            category = category.toLowerCase()
        ))

        const settings: HomepageSettings[] = await prisma.homepageSettings.findMany({});

        const image_file: File | null = formData.get("image") as File;
        let image;
        if (image_file) {
            const type = 'settings'
            image = await handleImageUpload(image_file, type)
        }

        const sale_file: File | null = formData.get("saleImage") as File;
        let saleImage;
        if (sale_file) {
            const type = 'settings'
            saleImage = await handleImageUpload(sale_file, type)
        } else{
            saleImage = ''
        }

        if(settings[0]){
            if(image && settings[0].image){
                fs.unlink(settings[0].image, (err: any) => {
                    if(err){
                        console.error(err.message);
                        return;
                    }
                });
            } 
            if(image){
                await prisma.homepageSettings.update({
                    where: {
                        id: settings[0].id
                    },
                    data:{
                        categories: categories,
                        sale: sale === 'true',
                        saleText: saleText,
                        saleImage: saleImage.url,
                        image: image.url,
                    }
                })
            } else{
                await prisma.homepageSettings.update({
                    where: {
                        id: settings[0].id
                    },
                    data:{
                        categories: categories,
                        sale: sale === 'true',
                        saleText: saleText,
                        saleImage: saleImage.url
                    }
                })
            }
        } else{
            if(image){
                await prisma.homepageSettings.create({
                    data: {
                        categories: categories,
                        sale: sale === 'true',
                        saleText: saleText,
                        image: image,
                        saleImage: saleImage.url
                    }
                })
            } else{
                await prisma.homepageSettings.create({
                    data: {
                        categories: categories,
                        sale: sale === 'true',
                        saleText: saleText,
                        saleImage: saleImage.url
                    }
                })
            }
        }
        return NextResponse.json({ status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}