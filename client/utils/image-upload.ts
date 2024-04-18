import {v4 as uuidv4} from 'uuid';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function handleImageUpload(file: File, type: string){
    const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
    let extension: any = (file.name).match(imageReg);
    const uuid = uuidv4();
    const filename = uuid + extension[0];
    const blob = await put(`${type.toLowerCase()}/${filename}`, file, {
        access: 'public',
      });
    revalidatePath('/');
    return blob;
}