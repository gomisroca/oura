'use client';

import Button from '../ui/Button';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa6';
import Foldable from '../ui/Foldable';
import { api } from '@/trpc/react';

function SubcategoryFoldable() {
  const params = useParams();
  const searchParams = useSearchParams();
  const genderParam = searchParams.get('gender');
  const gender = genderParam === 'man' ? 'MALE' : genderParam === 'woman' ? 'FEMALE' : undefined;

  const sportId = Number(params.sport);
  const categoryId = Number(params.category);
  const subcategoryId = Number(params.subcategory);

  const { data: subcategories, status } = api.category.getSubcategories.useQuery({
    categoryId: categoryId ? categoryId : undefined,
    gender: gender,
  });

  if (!categoryId || status === 'error' || !subcategories) {
    return null;
  }
  return (
    <div>
      <Foldable
        button={{ name: 'Subcategories', text: <FaFilter size={20} />, className: 'px-[0.75rem] xl:px-10' }}
        addCaret={false}>
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            className="w-full self-start"
            href={
              genderParam
                ? `/sport/${sportId}/${categoryId}/${subcategory.id}?gender=${genderParam}`
                : `/sport/${sportId}/${categoryId}/${subcategory.id}`
            }>
            <Button
              key={subcategory.id}
              name={subcategory.name}
              className={`w-full ${subcategoryId === subcategory.id ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''}`}
              disabled={subcategoryId === subcategory.id}>
              {subcategory.name}
            </Button>
          </Link>
        ))}
      </Foldable>
    </div>
  );
}

export default SubcategoryFoldable;
