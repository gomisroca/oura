'use client';

import { type Product } from 'generated/prisma';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';

// Types
interface SubcategoryUpdateProps {
  id: string;
  sportId: string;
  categoryId: string;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: string[];
  disabled?: boolean;
  onChange: (selectedIds: string[]) => void;
}

interface FormState {
  name: string;
  selectedProducts: string[];
  isSubmitting: boolean;
  isDeleting: boolean;
  message: { error: boolean; message: string } | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  selectedProducts: [],
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch subcategory details',
  UPDATE_ERROR: 'Failed to update subcategory. Please try again.',
  DELETE_ERROR: 'Failed to delete subcategory. Please try again.',
  NAME_REQUIRED: 'Subcategory name is required',
} as const;

function ProductSelector({ products, selectedProducts, disabled, onChange }: ProductSelectorProps) {
  return (
    <div className="relative">
      <select
        name="products"
        className="w-full rounded-sm bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700"
        multiple
        size={Math.min(products.length, 6)}
        disabled={disabled}
        value={selectedProducts}
        onChange={(e) => onChange(Array.from(e.target.selectedOptions, (option) => option.value))}
        aria-label="Select products">
        {products.map((product) => (
          <option key={product.id} value={product.id} className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600">
            {product.name}
          </option>
        ))}
      </select>
      <div className="mt-1 text-sm text-slate-500">Hold Ctrl/Cmd to select multiple products</div>
    </div>
  );
}

export default function SubcategoryUpdate({ id, sportId, categoryId }: SubcategoryUpdateProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Queries
  const {
    data: subcategory,
    error: subcategoryError,
    isLoading: isLoadingSubcategory,
  } = api.category.getUniqueSubcategory.useQuery(
    { id: Number(id) },
    {
      retry: 2,
      enabled: Boolean(id),
    }
  );

  const {
    data: products,
    error: productsError,
    isLoading: isLoadingProducts,
  } = api.product.getAll.useQuery(undefined, {
    retry: 2,
  });

  // Mutations
  const updateSubcategory = api.category.updateSubcategory.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.UPDATE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: false,
          message: 'Subcategory updated successfully!',
        },
      }));
    },
  });

  const deleteSubcategory = api.category.deleteSubcategory.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.DELETE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      router.push(`/categories/${sportId}/${categoryId}`);
    },
  });

  // Effects
  useEffect(() => {
    if (subcategory) {
      setFormState((prev) => ({
        ...prev,
        name: subcategory.name,
        selectedProducts: subcategory.products.map((product) => product.id),
      }));
    }
  }, [subcategory]);

  // Handlers
  const handleError = (message: string) => {
    setFormState((prev) => ({
      ...prev,
      message: { error: true, message },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      handleError(ERROR_MESSAGES.NAME_REQUIRED);
      return;
    }

    updateSubcategory.mutate({
      id: Number(id),
      sportId: Number(sportId),
      categoryId: Number(categoryId),
      name: trimmedName,
      selectedProducts: formState.selectedProducts,
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this subcategory? This action cannot be undone.')) {
      deleteSubcategory.mutate({ id: Number(id) });
    }
  };

  // Loading states
  if (isLoadingSubcategory || isLoadingProducts) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Error states
  if (subcategoryError || productsError || !subcategory || !products) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-lg dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Update Subcategory</h2>
          <Button
            className="bg-red-500 px-4 py-2 hover:bg-red-600 xl:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 xl:dark:bg-red-600"
            onClick={handleDelete}
            disabled={formState.isDeleting}>
            {formState.isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Subcategory Name
            </label>
            <input
              id="name"
              className="w-full rounded-sm bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700"
              name="name"
              type="text"
              placeholder="Enter subcategory name"
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value, message: null }))}
              disabled={formState.isSubmitting}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="products" className="text-sm font-medium">
              Products
            </label>
            <ProductSelector
              products={products}
              selectedProducts={formState.selectedProducts}
              disabled={formState.isSubmitting}
              onChange={(selectedIds) =>
                setFormState((prev) => ({ ...prev, selectedProducts: selectedIds, message: null }))
              }
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={
              formState.isSubmitting ||
              (formState.name === subcategory.name &&
                JSON.stringify(formState.selectedProducts.sort()) ===
                  JSON.stringify(subcategory.products.map((p) => p.id).sort()))
            }>
            {formState.isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </form>

        {formState.message && (
          <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
        )}
      </div>
    </div>
  );
}
