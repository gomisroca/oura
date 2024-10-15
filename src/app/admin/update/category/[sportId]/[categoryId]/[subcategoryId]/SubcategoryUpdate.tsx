'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { type Product } from '@prisma/client';
import { useEffect, useState } from 'react';

function ProductSelector({
  products,
  subcategoryProducts,
  setSelectedProducts,
}: {
  products: Product[];
  subcategoryProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) => setSelectedProducts(Array.from(e.target.selectedOptions, (option) => option.value))}>
      {products.map((product) => (
        <option key={product.id} value={product.id} selected={subcategoryProducts.includes(product.id)}>
          {product.name}
        </option>
      ))}
    </select>
  );
}

export default function SubcategoryUpdate({
  id,
  sportId,
  categoryId,
}: {
  id: string;
  sportId: string;
  categoryId: string;
}) {
  const utils = api.useUtils();
  const { data: subcategory } = api.category.getUniqueSubcategory.useQuery({ id: Number(id) });
  const { data: products } = api.product.getAll.useQuery();

  const [formMessage, setFormMessage] = useState({ error: true, message: '' });
  const [name, setName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (subcategory) {
      setName(subcategory.name);
      setSelectedProducts(subcategory.products.map((product) => product.id));
    }
  }, [subcategory]);

  const updateSubcategory = api.category.updateSubcategory.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormMessage({ error: false, message: 'Subcategory updated successfully!' });
    },
  });

  const deleteSubcategory = api.category.deleteSubcategory.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormMessage({ error: false, message: 'Subcategory deleted successfully!' });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormMessage({ error: false, message: '' });
    e.preventDefault();

    updateSubcategory.mutate({
      id: Number(id),
      sportId: Number(sportId),
      categoryId: Number(categoryId),
      name,
      selectedProducts,
    });
  };

  if (subcategory) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="bg-red-500/80 dark:bg-red-600 xl:bg-red-500/80 xl:dark:bg-red-600/80"
          onClick={() => deleteSubcategory.mutate({ id: Number(id) })}>
          Delete
        </Button>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <p>Name</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="name"
            type="text"
            placeholder="Sport Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {products && (
            <>
              <p>Products</p>
              <ProductSelector
                products={products}
                subcategoryProducts={subcategory.products.map((product) => product.id)}
                setSelectedProducts={setSelectedProducts}
              />
            </>
          )}
          <Button type="submit" disabled={updateSubcategory.isPending}>
            {updateSubcategory.isPending ? 'Submitting...' : 'Submit'}
          </Button>
          {formMessage.message && (
            <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />
          )}
        </form>
      </div>
    );
  }
  return null;
}
