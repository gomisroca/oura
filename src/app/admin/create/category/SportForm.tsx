'use client';

import { type Sport } from 'generated/prisma';
import React, { useState } from 'react';
import { type SportWithCategories } from 'types';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';

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
  CREATE_ERROR: 'Failed to create sport. Please try again.',
  NAME_REQUIRED: 'Sport name is required',
} as const;

export default function SportForm({ sports }: { sports: SportWithCategories[] }) {
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Create mutation
  const createSport = api.category.createSport.useMutation({
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
          message: 'Category updated successfully!',
        },
      }));
    },
  });

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

    createSport.mutate({
      sport: trimmedName,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      name: e.target.value,
      message: null,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Existing Sports</h2>
          {sports.map((sport: Sport) => (
            <span className="rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700" key={sport.id}>
              {sport.name}
            </span>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Sport Name
            </label>
            <input
              id="name"
              className="w-full rounded-full bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700"
              name="name"
              type="text"
              placeholder="Enter sport name"
              onChange={handleNameChange}
              disabled={formState.isSubmitting}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!formState.name || formState.isSubmitting}>
            {formState.isSubmitting ? 'Creating...' : 'Create Sport'}
          </Button>
        </form>

        {formState.message && (
          <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
        )}
      </div>
    </div>
  );
}
