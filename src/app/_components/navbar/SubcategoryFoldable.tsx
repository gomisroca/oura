'use client';

import { skipToken } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { FaFilter } from 'react-icons/fa6';

import { api } from '@/trpc/react';

import Button from '../ui/Button';
import Foldable from '../ui/Foldable';

function SubcategoryFoldableWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubcategoryFoldable />
    </Suspense>
  );
}

function SubcategoryFoldable() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const genderParam = searchParams.get('gender');
  const gender = genderParam === 'man' ? 'MALE' : genderParam === 'woman' ? 'FEMALE' : undefined;

  const sportId = Number(params.sport);
  const categoryId = Number(params.category);
  const subcategoryId = Number(params.subcategory);

  const { data: subcategories, status } = api.category.getSubcategories.useQuery(
    categoryId
      ? {
          categoryId: categoryId,
          sale: pathname.includes('sale'),
          gender: gender,
        }
      : skipToken
  );

  if (!categoryId || status === 'error' || !subcategories) {
    return null;
  }
  return (
    <div>
      <Foldable button={{ name: 'Subcategories', text: <FaFilter size={20} />, className: 'px-3' }} addCaret={false}>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            className="w-full self-start"
            href={
              pathname.includes('sale')
                ? `/sale/${sportId}/${categoryId}/${subcategory.id}`
                : genderParam
                  ? `/sport/${sportId}/${categoryId}/${subcategory.id}?gender=${genderParam}`
                  : `/sport/${sportId}/${categoryId}/${subcategory.id}`
            }>
            <Button
              key={subcategory.id}
              name={subcategory.name}
              className={`w-full ${subcategoryId === subcategory.id ? 'bg-neutral-300 xl:bg-neutral-300 dark:bg-neutral-700 xl:dark:bg-neutral-700' : ''}`}
              disabled={subcategoryId === subcategory.id}>
              {subcategory.name}
            </Button>
          </Link>
        ))}
      </Foldable>
    </div>
  );
}

export default SubcategoryFoldableWrapper;
