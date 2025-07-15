import { v4 as uuidv4 } from 'uuid';

import supabase from '@/supabase';

async function getToken(id: string, bucket: string) {
  const { data } = await supabase.storage.from(bucket).createSignedUploadUrl(`${id}.png`);
  return data?.token;
}

async function convertBase64ToFile(dataUrl: string, id: string) {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], id + '.png', { type: 'image/png' });
}

async function uploadImage(image: string, bucket = 'products') {
  try {
    const id = uuidv4();
    const file = await convertBase64ToFile(image, id);

    const token = await getToken(id, bucket);
    if (token) {
      const { data } = await supabase.storage.from(bucket).uploadToSignedUrl(`${id}.png`, token, file);
      if (data) {
        return data?.fullPath as string;
      }
    }
  } catch (_error) {
    throw new Error('Failed to upload image');
  }
}

export default uploadImage;
