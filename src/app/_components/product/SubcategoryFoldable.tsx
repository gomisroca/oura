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

  const subcategories = api.category.getSubcategories.useQuery({ categoryId: params.category as string });
  return (
    <div className="absolute right-36 xl:right-[15rem]">
      <Foldable
        button={{ name: 'Subcategories', text: <FaFilter size={20} />, className: 'px-4 xl:px-10' }}
        addCaret={false}>
        {subcategories.data?.map((subcategory) => (
          <Link
            key={subcategory.id}
            className="w-full self-start"
            href={`/sport/${params.sport as string}/${params.category as string}/${subcategory.id}`}>
            <Button
              key={subcategory.id}
              name={subcategory.name}
              className={`w-full ${params.subcategory === subcategory.id ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''}`}
              disabled={params.subcategory === subcategory.id}>
              {subcategory.name}
            </Button>
          </Link>
        ))}
      </Foldable>
    </div>
  );
}

export default SubcategoryFoldable;
