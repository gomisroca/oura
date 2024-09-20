import supabase from '@/supabase';
import { v4 as uuidv4 } from 'uuid';

export function checkFileType(file: File) {
  const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const fileType = file.type;
  if (!fileTypes.includes(fileType)) {
    return false;
  }
  return true;
}

export function checkFileSize(file: File) {
  const fileSize = file.size;
  if (fileSize > 1024 * 1024 * 2) {
    return false;
  }
  return true;
}

async function getToken(id: string) {
  const { data } = await supabase.storage.from('products').createSignedUploadUrl(`${id}.png`);
  return data?.token;
}

async function uploadImage(image: File) {
  const id = uuidv4();

  const token = await getToken(id);
  if (token) {
    const { data } = await supabase.storage.from('products').uploadToSignedUrl(`${id}.png`, token, image);
    if (data) {
      return data?.fullPath as string;
    }
  }
}

export default uploadImage;
