'use client';

import { type Product } from 'generated/prisma';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  image: string;
  selectedProducts: string[];
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  image: '',
  selectedProducts: [],
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch products.',
  CREATE_ERROR: 'Failed to create sale. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

function ProductSelector({
  products,
  setFormState,
}: {
  products: Product[];
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <select
      name="products"
      className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
      multiple
      onChange={(e) =>
        setFormState((prev) => ({
          ...prev,
          selectedProducts: Array.from(e.target.selectedOptions, (option) => option.value),
        }))
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
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching products
  const { data: products, error: fetchError, isLoading } = api.product.getAll.useQuery();

  // Create mutation
  const createSale = api.sale.create.useMutation({
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
          message: error.message || ERROR_MESSAGES.CREATE_ERROR,
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
          message: 'Sale created successfully!',
        },
      }));
    },
  });

  // Form handlers
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target.files![0];

      if (selectedFile) {
        const isValidFileType = checkFileType(selectedFile);
        if (!isValidFileType) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_TYPE_ERROR,
            },
          }));
          return;
        }
        const isValidFileSize = checkFileSize(selectedFile);
        if (!isValidFileSize) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_SIZE_ERROR,
            },
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target!.result;
          setFormState((prev) => ({ ...prev, image: imageData as string }));
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (_error) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR,
        },
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formState.name ||
      !formState.startDate ||
      !formState.startTime ||
      !formState.endDate ||
      !formState.endTime ||
      !formState.image ||
      !formState.selectedProducts
    ) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }

    const startDateTime = new Date(`${formState.startDate}T${formState.startTime}`);
    const endDateTime = new Date(`${formState.endDate}T${formState.endTime}`);

    createSale.mutate({
      name: formState.name,
      startDate: startDateTime,
      endDate: endDateTime,
      image: formState.image,
      selectedProducts: formState.selectedProducts,
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }
  if (fetchError || !products) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Sale Name"
          onChange={handleChange}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startDate"
          type="date"
          placeholder="Start Date"
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startTime"
          type="time"
          placeholder="Start Time"
          onChange={handleChange}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endDate"
          type="date"
          placeholder="End Date"
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endTime"
          type="time"
          placeholder="End Time"
          onChange={handleChange}
          required
        />
        <p>Image</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImage(e)}
        />
        {products && (
          <>
            <p>Products</p>
            <ProductSelector products={products} setFormState={setFormState} />
          </>
        )}
        <Button type="submit" disabled={createSale.isPending}>
          {createSale.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
      )}
    </div>
  );
}
