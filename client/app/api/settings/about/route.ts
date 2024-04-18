import prisma from "@/utils/db";
import fs from 'fs';
import { handleImageUpload } from "@/utils/image-upload";
import { AboutSettings } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const settings: AboutSettings[] = await prisma.aboutSettings.findMany({});
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

        const settings: AboutSettings[] = await prisma.aboutSettings.findMany({});

        const image_file: File | null = formData.get("image") as File;
        let image;
        if (image_file) {
            const type = 'settings'
            image = await handleImageUpload(image_file, type)
        }

        if(settings[0]){
            if(settings[0].image){
                fs.unlink(settings[0].image, (err: any) => {
                    if(err){
                        console.error(err.message);
                        return;
                    }
                });
            } 
            if(image){
                await prisma.aboutSettings.update({
                    where: {
                        id: settings[0].id
                    },
                    data:{
                        image: image.url
                    }
                })
            }
        } else{
            if(image){
                await prisma.aboutSettings.create({
                    data: {
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