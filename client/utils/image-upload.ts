import path from "path";
import { writeFile } from "fs/promises";
import {v4 as uuidv4} from 'uuid';
import fs from 'fs';

export async function handleImageUpload(file: File, type: string, gender?: string, category?: string, subcategory?: string){
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    let extension: any = (file.name).match(imageReg);
    const uuid = uuidv4();
    const filename = uuid + extension[0];

    try {
        let filePath = path.join(process.cwd(), "public", type.toLowerCase());
        let urlPath = `/${type.toLowerCase()}`
        if (gender) {
            filePath = path.join(filePath, gender.toLowerCase());
            urlPath = urlPath + `/${gender.toLowerCase()}`; 
        }
        if (category) {
            filePath = path.join(filePath, category.toLowerCase());
            urlPath = urlPath + `/${category.toLowerCase()}`; 
        }
        if (subcategory) {
            filePath = path.join(filePath, subcategory.toLowerCase());
            urlPath = urlPath + `/${subcategory.toLowerCase()}`; 
        }
        fs.mkdir(filePath, { recursive: true }, async(err) => {
            if (err) throw err;
            filePath = path.join(filePath, filename);
            await writeFile(filePath, buffer);
        });
        return  urlPath + "/" + filename
    } catch (error) {
        console.log("Error occured ", error);
        return null
    }
}