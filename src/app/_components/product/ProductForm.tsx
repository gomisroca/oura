'use client';

import { useState } from 'react';

import { api } from '@/trpc/react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

export function ProductForm() {
  const utils = api.useUtils();

  const [formMessage, setFormMessage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [onSalePrice, setOnSalePrice] = useState(0);
  const [image, setImage] = useState<string>();

  const createProduct = api.product.create.useMutation({
    onError: () => {
      setFormMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setFormMessage('');
      }, 5000);
    },
    onSuccess: async () => {
      await utils.product.invalidate();
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    if (selectedFile) {
      setFormMessage('');
      // Validate file type and size
      const isValidFileType = checkFileType(selectedFile);
      if (!isValidFileType) {
        setFormMessage('Please upload a valid image file');
        return;
      }
      const isValidFileSize = checkFileSize(selectedFile);
      if (!isValidFileSize) {
        setFormMessage('Please upload a file smaller than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target!.result;
        setImage(imageData as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormMessage('');
    e.preventDefault();

    createProduct.mutate({ name, description, basePrice, onSalePrice, image });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <InputField
        name="name"
        type="text"
        placeholder="Name"
        handleValueChange={(value: string) => setName(value)}
        required
      />
      <InputField
        name="description"
        type="text"
        placeholder="Description"
        required
        handleValueChange={(value: string) => setDescription(value)}
      />
      <InputField
        name="basePrice"
        type="number"
        placeholder="Base Price"
        required
        handleValueChange={(value: string) => setBasePrice(Number(value))}
      />
      <InputField
        name="onSalePrice"
        type="number"
        placeholder="On Sale Price"
        required
        handleValueChange={(value: string) => setOnSalePrice(Number(value))}
      />
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => handleImage(e)}
      />
      <Button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Submitting...' : 'Submit'}
      </Button>
      {formMessage && <p className="m-auto text-red-500">{formMessage}</p>}
    </form>
  );
}
