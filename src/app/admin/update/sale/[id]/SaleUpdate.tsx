'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { env } from '@/env';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { type Product } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SaleForm {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  image?: string;
  selectedProducts: string[];
}

function ProductSelector({
  products,
  saleProducts,
  form,
  setForm,
}: {
  products: Product[];
  saleProducts: string[];
  form: SaleForm;
  setForm: React.Dispatch<React.SetStateAction<SaleForm>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) => {
        const selectedProducts = Array.from(e.target.selectedOptions, (option) => option.value);
        setForm({ ...form, selectedProducts });
      }}>
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
  const [form, setForm] = useState<SaleForm>({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    selectedProducts: [],
  });

  useEffect(() => {
    if (sale) {
      const name = sale.name;
      const startDateObj = new Date(sale.startDate);
      const startDate = startDateObj.toISOString().split('T')[0]!;
      const startTime = startDateObj.toTimeString().slice(0, 5);

      const endDateObj = new Date(sale.endDate);
      const endDate = endDateObj.toISOString().split('T')[0]!;
      const endTime = endDateObj.toTimeString().slice(0, 5);
      const selectedProducts = sale.products.map((product) => product.productId);
      setForm({ name, startDate, startTime, endDate, endTime, selectedProducts });
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

  const deleteSale = api.sale.delete.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.sale.invalidate();
      setFormMessage({ error: false, message: 'Sale deleted successfully!' });
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
        setForm({ ...form, image: imageData as string });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormMessage({ error: false, message: '' });
    e.preventDefault();

    const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
    const endDateTime = new Date(`${form.endDate}T${form.endTime}`);

    updateSale.mutate({
      id,
      name: form.name,
      startDate: startDateTime,
      endDate: endDateTime,
      image: form.image,
      selectedProducts: form.selectedProducts,
    });
  };

  if (sale) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="bg-red-500/80 dark:bg-red-600 xl:bg-red-500/80 xl:dark:bg-red-600/80"
          onClick={() => deleteSale.mutate({ id })}>
          Delete
        </Button>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <p>Name</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="name"
            type="text"
            placeholder="Sale Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <p>Start Date</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="startDate"
            type="date"
            placeholder="Start Date"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="startTime"
            type="time"
            placeholder="Start Time"
            value={form.startTime}
            onChange={handleChange}
            required
          />
          <p>End Date</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="endDate"
            type="date"
            placeholder="End Date"
            value={form.endDate}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="endTime"
            type="time"
            placeholder="End Time"
            value={form.endTime}
            onChange={handleChange}
            required
          />
          {sale.image ? (
            <Image
              unoptimized
              src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`}
              alt={form.name}
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
                form={form}
                setForm={setForm}
              />
            </>
          )}
          <Button type="submit" disabled={updateSale.isPending}>
            {updateSale.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
        <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />
      </div>
    );
  }
  return null;
}
