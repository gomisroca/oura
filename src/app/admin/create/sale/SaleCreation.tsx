'use client';

import Button from '@/app/_components/ui/Button';
import InputField from '@/app/_components/ui/InputField';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { type Product } from '@prisma/client';
import { useState } from 'react';

function ProductSelector({
  products,
  setSelectedProducts,
}: {
  products: Product[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) => setSelectedProducts(Array.from(e.target.selectedOptions, (option) => option.value))}>
      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  );
}

export default function SaleCreation() {
  const utils = api.useUtils();
  const { data: products } = api.product.getAll.useQuery();

  const [formMessage, setFormMessage] = useState({ error: true, message: '' });
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [image, setImage] = useState<string>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const createSale = api.sale.create.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.sale.invalidate();
      setFormMessage({ error: false, message: 'Sale created successfully!' });
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    if (selectedFile) {
      setFormMessage({ error: false, message: '' });

      const isValidFileType = checkFileType(selectedFile);
      if (!isValidFileType) {
        setFormMessage({ error: true, message: 'Please upload a valid image file' });
        return;
      }
      const isValidFileSize = checkFileSize(selectedFile);
      if (!isValidFileSize) {
        setFormMessage({ error: true, message: 'Please upload a file smaller than 2MB' });
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
    setFormMessage({ error: false, message: '' });
    e.preventDefault();

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    console.log(name);
    console.log(startDate);
    console.log(endDate);
    console.log(image);
    console.log(selectedProducts);

    createSale.mutate({
      name,
      startDate: startDateTime,
      endDate: endDateTime,
      image,
      selectedProducts,
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <p>Name</p>
      <InputField
        name="name"
        type="text"
        placeholder="Sale Name"
        handleValueChange={(value: string) => setName(value)}
        required
      />
      <p>Start Date</p>
      <InputField
        name="startDate"
        type="date"
        placeholder="Start Date"
        handleValueChange={(value: string) => setStartDate(value)}
        required
      />
      <InputField
        name="startTime"
        type="time"
        placeholder="Start Time"
        handleValueChange={(value: string) => setStartTime(value)}
        required
      />
      <p>End Date</p>
      <InputField
        name="endDate"
        type="date"
        placeholder="End Date"
        handleValueChange={(value: string) => setEndDate(value)}
        required
      />
      <InputField
        name="endTime"
        type="time"
        placeholder="End Time"
        handleValueChange={(value: string) => setEndTime(value)}
        required
      />
      <p>Image</p>
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => handleImage(e)}
      />
      {products && (
        <>
          <p>Products</p>
          <ProductSelector products={products} setSelectedProducts={setSelectedProducts} />
        </>
      )}
      <Button type="submit" disabled={createSale.isPending}>
        {createSale.isPending ? 'Submitting...' : 'Submit'}
      </Button>
      {formMessage.message && <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />}
    </form>
  );
}
