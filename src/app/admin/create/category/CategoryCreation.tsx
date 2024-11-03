'use client';

import { api } from '@/trpc/react';
import React, { useState } from 'react';
import { type SportWithCategories } from 'types';
import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { useRouter } from 'next/navigation';
import SportForm from './SportForm';
import CategoryForm from './CategoryForm';
import SubcategoryForm from './SubcategoryForm';

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch category details',
} as const;

function CategoryCreation() {
  const router = useRouter();
  const { data: sports, error: fetchError, isLoading } = api.category.getSports.useQuery();
  const [selectedForm, setSelectedForm] = useState<'SPORT' | 'CATEGORY' | 'SUBCATEGORY'>('SPORT');

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading sport details...</div>
      </div>
    );
  }
  if (fetchError || !sports) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => setSelectedForm('SPORT')}
          disabled={selectedForm === 'SPORT'}
          className={
            selectedForm === 'SPORT' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Sport
        </Button>
        <Button
          onClick={() => setSelectedForm('CATEGORY')}
          disabled={selectedForm === 'CATEGORY'}
          className={
            selectedForm === 'CATEGORY' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Category
        </Button>
        <Button
          onClick={() => setSelectedForm('SUBCATEGORY')}
          disabled={selectedForm === 'SUBCATEGORY'}
          className={
            selectedForm === 'SUBCATEGORY' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Subcategory
        </Button>
      </div>
      {selectedForm === 'SPORT' && <SportForm sports={sports as SportWithCategories[]} />}
      {selectedForm === 'CATEGORY' && <CategoryForm sports={sports as SportWithCategories[]} />}
      {selectedForm === 'SUBCATEGORY' && <SubcategoryForm sports={sports as SportWithCategories[]} />}
    </div>
  );
}

export default CategoryCreation;
