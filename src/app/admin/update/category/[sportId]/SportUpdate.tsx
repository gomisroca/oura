'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types
interface SportUpdateProps {
  id: string;
}

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch sport details',
  UPDATE_ERROR: 'Failed to update sport. Please try again.',
  DELETE_ERROR: 'Failed to delete sport. Please try again.',
  NAME_REQUIRED: 'Sport name is required',
} as const;

export default function SportUpdate({ id }: SportUpdateProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching category details
  const {
    data: sport,
    error: fetchError,
    isLoading,
  } = api.category.getUniqueSport.useQuery(
    { id: Number(id) },
    {
      retry: 2,
      enabled: Boolean(id),
    }
  );

  // Update mutation
  const updateSport = api.category.updateSport.useMutation({
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
          message: 'Sport updated successfully!',
        },
      }));
    },
  });

  // Delete mutation
  const deleteSport = api.category.deleteSport.useMutation({
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
    if (sport) {
      setFormState((prev) => ({
        ...prev,
        name: sport.name,
      }));
    }
  }, [sport]);

  // Form handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.NAME_REQUIRED,
        },
      }));
      return;
    }

    updateSport.mutate({
      id: Number(id),
      name: trimmedName,
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteSport.mutate({ id: Number(id) });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      name: e.target.value,
      message: null,
    }));
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading sport details...</div>
      </div>
    );
  }

  if (fetchError || !sport) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Update Sport</h2>
          <Button
            className="bg-red-500 px-4 py-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 xl:bg-red-500 xl:dark:bg-red-600"
            onClick={handleDelete}
            disabled={formState.isDeleting}>
            {formState.isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Sport Name
            </label>
            <input
              id="name"
              className="w-full rounded-full bg-slate-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              name="name"
              type="text"
              placeholder="Enter sport name"
              value={formState.name}
              onChange={handleNameChange}
              disabled={formState.isSubmitting}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={formState.isSubmitting || formState.name === sport.name}>
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
