'use client';

import { type Subcategory } from 'generated/prisma';
import React, { useState } from 'react';
import { type CategoryWithSubcategories, type SportWithCategories } from 'types';

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
  CREATE_ERROR: 'Failed to create subcategory. Please try again.',
  NAME_REQUIRED: 'Subcategory name is required',
} as const;

export default function SubcategoryForm({ sports }: { sports: SportWithCategories[] }) {
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories>();

  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const createSubcategory = api.category.createSubcategory.useMutation({
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
          message: 'Subcategory created successfully!',
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

    createSubcategory.mutate({
      sportId: selectedSport!.id,
      categoryId: selectedCategory!.id,
      subcategory: trimmedName,
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
      <div className="flex w-full max-w-md flex-col gap-6 rounded-sm bg-white p-6 shadow-lg dark:bg-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <select
            id="sport"
            value={String(selectedSport?.id) ?? ''}
            className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
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
            <select
              value={String(selectedCategory?.id) ?? ''}
              className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
              required
              onChange={(e) => {
                setSelectedCategory(
                  selectedSport.categories.find(
                    (category: CategoryWithSubcategories) => category.id === Number(e.target.value)
                  )
                );
              }}>
              <option value="" className="hidden">
                Select Category
              </option>
              {selectedSport.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          {selectedCategory && (
            <>
              {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span>Existing Subcategories</span>
                  <div className="flex flex-row gap-2">
                    {selectedCategory.subcategories.map((subcategory: Subcategory) => (
                      <span className="rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700" key={subcategory.id}>
                        {subcategory.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <input
                id="name"
                className="w-full rounded-sm bg-neutral-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700"
                name="name"
                type="text"
                placeholder="Enter subcategory name"
                onChange={handleNameChange}
                disabled={formState.isSubmitting}
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={!selectedSport || !selectedCategory || !formState.name || formState.isSubmitting}>
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
