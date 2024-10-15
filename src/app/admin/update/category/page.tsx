'use client';

import { api } from '@/trpc/react';
import Link from 'next/link';
import React from 'react';

export default function ProductUpdateList() {
  const { data: sports } = api.category.getSports.useQuery();
  if (sports) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {sports.map((sport) => (
          <div key={sport.id} className="w-[20rem]">
            <div className="flex h-full w-full flex-col items-center gap-2 rounded-xl border border-slate-600/10 bg-slate-200/30 py-4 dark:border-slate-400/10 dark:bg-slate-800/30">
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <Link
                  href={`/admin/update/category/${sport.id}`}
                  className="rounded-xl border border-slate-600/10 bg-slate-200/30 px-4 py-2 hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:hover:bg-slate-700/30">
                  {' '}
                  <h1 className="text-2xl font-bold">{sport.name}</h1>
                </Link>
                {sport.categories.map((category) => (
                  <div key={category.id} className="flex flex-col items-center gap-2">
                    <Link
                      href={`/admin/update/category/${sport.id}/${category.id}`}
                      className="rounded-xl border border-slate-600/10 bg-slate-200/30 px-4 py-2 hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:hover:bg-slate-700/30">
                      <p className="text-lg font-bold">{category.name}</p>
                    </Link>
                    <div key={category.id} className="flex items-center gap-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/admin/update/category/${sport.id}/${category.id}/${subcategory.id}`}
                          className="rounded-xl border border-slate-600/10 bg-slate-200/30 px-4 py-2 hover:border-slate-600/40 hover:bg-slate-300/30 dark:border-slate-400/10 dark:bg-slate-800/30 dark:hover:bg-slate-700/30">
                          <p>{subcategory.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
