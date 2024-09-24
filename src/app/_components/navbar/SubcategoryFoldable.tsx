'use client';

import Button from '../ui/Button';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaFilter } from 'react-icons/fa6';
import Foldable from '../ui/Foldable';
import { api } from '@/trpc/react';

function SubcategoryFoldable() {
  const params = useParams();
  if (!params.category || !params.sport) {
    return null;
  }

  const categoryId = Number(params.category);
  const subcategoryId = Number(params.subcategory);

  const subcategories = api.category.getSubcategories.useQuery({ categoryId: categoryId });
  return (
    <div>
      <Foldable
        button={{ name: 'Subcategories', text: <FaFilter size={20} />, className: 'px-[0.75rem] xl:px-10' }}
        addCaret={false}>
        {subcategories.data?.map((subcategory) => (
          <Link
            key={subcategory.id}
            className="w-full self-start"
            href={`/sport/${params.sport as string}/${categoryId}/${subcategory.id}`}>
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
