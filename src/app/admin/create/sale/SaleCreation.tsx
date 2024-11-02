'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { type Product } from '@prisma/client';
import { useState } from 'react';

interface SaleForm {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  image: string;
  selectedProducts: string[];
}

function ProductSelector({
  products,
  form,
  setForm,
}: {
  products: Product[];
  form: SaleForm;
  setForm: React.Dispatch<React.SetStateAction<SaleForm>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) =>
        setForm({ ...form, selectedProducts: Array.from(e.target.selectedOptions, (option) => option.value) })
      }>
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
  const [form, setForm] = useState<SaleForm>({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    image: '',
    selectedProducts: [],
  });

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

    createSale.mutate({
      name: form.name,
      startDate: startDateTime,
      endDate: endDateTime,
      image: form.image,
      selectedProducts: form.selectedProducts,
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <p>Name</p>
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        name="name"
        type="text"
        placeholder="Sale Name"
        onChange={handleChange}
        required
      />
      <p>Start Date</p>
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        name="startDate"
        type="date"
        placeholder="Start Date"
        onChange={handleChange}
        required
      />
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        name="startTime"
        type="time"
        placeholder="Start Time"
        onChange={handleChange}
        required
      />
      <p>End Date</p>
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        name="endDate"
        type="date"
        placeholder="End Date"
        onChange={handleChange}
        required
      />
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        name="endTime"
        type="time"
        placeholder="End Time"
        onChange={handleChange}
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
          <ProductSelector products={products} form={form} setForm={setForm} />
        </>
      )}
      <Button type="submit" disabled={createSale.isPending}>
        {createSale.isPending ? 'Submitting...' : 'Submit'}
      </Button>
      <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />
    </form>
  );
}
