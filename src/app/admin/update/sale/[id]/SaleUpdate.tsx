'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { env } from '@/env';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { type Product } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SaleUpdateProps {
  id: string;
}

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
  image?: string;
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
  selectedProducts: [],
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch sale details',
  UPDATE_ERROR: 'Failed to update sale. Please try again.',
  DELETE_ERROR: 'Failed to delete sale. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

function ProductSelector({
  products,
  saleProducts,
  form,
  setForm,
}: {
  products: Product[];
  saleProducts: string[];
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <div className="relative">
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
      <div className="mt-1 text-sm text-slate-500">Hold Ctrl/Cmd to select multiple products</div>
    </div>
  );
}

export default function SaleUpdate({ id }: SaleUpdateProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching sale details
  const {
    data: sale,
    error: fetchSaleError,
    isLoading: isSaleLoading,
  } = api.sale.getUnique.useQuery(id, {
    retry: 2,
    enabled: Boolean(id),
  });
  const { data: products, error: fetchProductsError, isLoading: isProductsLoading } = api.product.getAll.useQuery();

  // Update mutation
  const updateSale = api.sale.update.useMutation({
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
          message: 'Sale updated successfully!',
        },
      }));
    },
  });

  // Delete mutation
  const deleteSale = api.sale.delete.useMutation({
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
      router.back();
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: false,
          message: 'Sport deleted successfully!',
        },
      }));
    },
  });

  // Set initial form data
  useEffect(() => {
    if (sale) {
      const startDateObj = new Date(sale.startDate);
      const startDate = startDateObj.toISOString().split('T')[0]!;
      const startTime = startDateObj.toTimeString().slice(0, 5);

      const endDateObj = new Date(sale.endDate);
      const endDate = endDateObj.toISOString().split('T')[0]!;
      const endTime = endDateObj.toTimeString().slice(0, 5);

      setFormState((prev) => ({
        ...prev,
        name: sale.name,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        selectedProducts: sale.products.map((product) => product.productId),
      }));
    }
  }, [sale]);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      deleteSale.mutate({ id });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = formState.name.trim();
    if (
      !trimmedName ||
      !formState.startDate ||
      !formState.startTime ||
      !formState.endDate ||
      !formState.endTime ||
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

    updateSale.mutate({
      id,
      name: formState.name,
      startDate: startDateTime,
      endDate: endDateTime,
      image: formState.image,
      selectedProducts: formState.selectedProducts,
    });
  };

  // Loading and error states
  if (isSaleLoading || isProductsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading sale details...</div>
      </div>
    );
  }
  if (fetchSaleError || fetchProductsError || !sale || !products) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="bg-red-500 px-4 py-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 xl:bg-red-500 xl:dark:bg-red-600"
        onClick={handleDelete}
        disabled={formState.isDeleting}>
        {formState.isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Sale Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startDate"
          type="date"
          placeholder="Start Date"
          value={formState.startDate}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="startTime"
          type="time"
          placeholder="Start Time"
          value={formState.startTime}
          onChange={handleChange}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endDate"
          type="date"
          placeholder="End Date"
          value={formState.endDate}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="endTime"
          type="time"
          placeholder="End Time"
          value={formState.endTime}
          onChange={handleChange}
          required
        />
        {sale.image ? (
          <Image
            unoptimized
            src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${sale.image}`}
            alt={formState.name}
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
              form={formState}
              setForm={setFormState}
            />
          </>
        )}
        <Button type="submit" disabled={updateSale.isPending}>
          {updateSale.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
      )}
    </div>
  );
}
