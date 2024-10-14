'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { env } from '@/env';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { type Product } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function ProductSelector({
  products,
  saleProducts,
  setSelectedProducts,
}: {
  products: Product[];
  saleProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) => setSelectedProducts(Array.from(e.target.selectedOptions, (option) => option.value))}>
      {products.map((product) => (
        <option key={product.id} value={product.id} selected={saleProducts.includes(product.id)}>
          {product.name}
        </option>
      ))}
    </select>
  );
}

export default function SaleUpdate({ id }: { id: string }) {
  const utils = api.useUtils();
  const { data: sale } = api.sale.getUnique.useQuery(id);
  const { data: products } = api.product.getAll.useQuery();

  const [formMessage, setFormMessage] = useState({ error: true, message: '' });
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [image, setImage] = useState<string>();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (sale) {
      setName(sale.name);
      const startDateObj = new Date(sale.startDate);
      setStartDate(startDateObj.toISOString().split('T')[0]!);
      setStartTime(startDateObj.toTimeString().slice(0, 5));

      // Format endDate and endTime from sale.endDate
      const endDateObj = new Date(sale.endDate);
      setEndDate(endDateObj.toISOString().split('T')[0]!);
      setEndTime(endDateObj.toTimeString().slice(0, 5));
      setSelectedProducts(sale.products.map((product) => product.productId));
    }
  }, [sale]);

  const updateSale = api.sale.update.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.sale.invalidate();
      setFormMessage({ error: false, message: 'Sale updated successfully!' });
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

    updateSale.mutate({
      id,
      name,
      startDate: startDateTime,
      endDate: endDateTime,
      image,
      selectedProducts,
    });
  };
  if (sale) {
    return (
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Sale Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startDate"
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startTime"
          type="time"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endDate"
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endTime"
          type="time"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        {sale.image ? (
          <Image
            src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`}
            alt={name}
            width={200}
            height={250}
            className="m-auto rounded-xl"
          />
        ) : (
          <p>No image uploaded</p>
        )}
        <p>New Image (optional)</p>
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
            <ProductSelector
              products={products}
              saleProducts={sale.products.map((product) => product.productId)}
              setSelectedProducts={setSelectedProducts}
            />
          </>
        )}
        <Button type="submit" disabled={updateSale.isPending}>
          {updateSale.isPending ? 'Submitting...' : 'Submit'}
        </Button>
        {formMessage.message && <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />}
      </form>
    );
  }
  return null;
}
