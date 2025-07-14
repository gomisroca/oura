'use client';

import { type Category } from 'generated/prisma';
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
  CREATE_ERROR: 'Failed to create category. Please try again.',
  NAME_REQUIRED: 'Category name is required',
} as const;

export default function CategoryForm({ sports }: { sports: SportWithCategories[] }) {
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();

  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const createCategory = api.category.createCategory.useMutation({
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

    createCategory.mutate({
      sportId: selectedSport!.id,
      category: trimmedName,
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
    sports && (
      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <select
            id="sport"
            value={String(selectedSport?.id) ?? ''}
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            required
            onChange={(e) => {
              setSelectedSport(sports.find((sport: SportWithCategories) => sport.id === Number(e.target.value)));
            }}>
            <option value="" className="hidden">
              Select Sport
            </option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
          {selectedSport && (
            <>
              {selectedSport.categories && selectedSport.categories.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span>Existing Categories</span>
                  <div className="flex flex-row gap-2">
                    {selectedSport.categories.map((category: Category) => (
                      <span className="rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700" key={category.id}>
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <input
                id="name"
                className="w-full rounded-full bg-slate-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700"
                name="name"
                placeholder="Enter category name"
                onChange={handleNameChange}
                disabled={formState.isSubmitting}
                required
              />

              <Button type="submit" className="w-full" disabled={!formState.name || formState.isSubmitting}>
                {formState.isSubmitting ? 'Creating...' : 'Create Sport'}
              </Button>
            </>
          )}
        </form>

        {formState.message && (
          <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
        )}
      </div>
    )
  );
}
