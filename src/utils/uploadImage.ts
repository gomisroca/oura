import supabase from '@/supabase';
import { v4 as uuidv4 } from 'uuid';

async function getToken(id: string) {
  const { data } = await supabase.storage.from('products').createSignedUploadUrl(`${id}.png`);
  return data?.token;
}

async function convertBase64ToFile(dataUrl: string, id: string) {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], id + '.png', { type: 'image/png' });
}

async function uploadImage(image: string) {
  const id = uuidv4();
  const file = await convertBase64ToFile(image, id);

  const token = await getToken(id);
  if (token) {
    const { data } = await supabase.storage.from('products').uploadToSignedUrl(`${id}.png`, token, file);
    if (data) {
      return data?.fullPath as string;
    }
  }
}

export default uploadImage;
