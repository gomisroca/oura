import prisma from "@/utils/db";
import fs from 'fs';
import { handleImageUpload } from "@/utils/image-upload";
import { CategorySettings } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { category: string } }
) {
    try{
       const categorySettings: CategorySettings | null = await prisma.categorySettings.findFirst({
            where: {
                category: params.category
            }
        });
        if(categorySettings){
            return NextResponse.json(categorySettings, { status: 200 })
        }
        return NextResponse.json('No Settings', { status: 404 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}

export async function POST(
    req: NextRequest,
    { params }: { params: { category: string } }
) {
    try{
       const settings: CategorySettings | null = await prisma.categorySettings.findFirst({
            where: {
                category: params.category
            }
        });
        const formData = await req.formData();
        const image_file: File | null = formData.get("image") as File;
        let image;
        if (image_file) {
            const type = 'settings'
            image = await handleImageUpload(image_file, type)
        }

        if(settings){
            if(settings?.image){
                fs.unlink(settings.image, (err: any) => {
                    if(err){
                        console.error(err.message);
                        return;
                    }
                });
            } 
            if(image){
                await prisma.categorySettings.update({ 
                    where: {
                        id: settings.id,
                    },
                    data: {
                        image: image.url
                    },
                });
            }
        } else{
            if(image){
                await prisma.categorySettings.create({
                    data: {
                        category: params.category,
                        image: image.url,
                    }
                })
            }
        }
        return NextResponse.json({ status: 200 })
    }catch(err: unknown){
        return NextResponse.json({ message: err }, { status: 500 })
    }   
}