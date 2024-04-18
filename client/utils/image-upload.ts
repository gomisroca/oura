import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function handleImageUpload(file: File, type: string){
    const blob = await put(`${type.toLowerCase()}/${file.name}`, file, {
        access: 'public',
      });
    revalidatePath('/');
    return blob;
    
}