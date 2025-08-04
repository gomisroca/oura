'use client';

import { useAtom, useSetAtom } from 'jotai';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaCaretLeft } from 'react-icons/fa6';
import { type SaleCategory } from 'types';

import { selectedCategoryAtom } from '@/atoms/selectedCategory';
import { api } from '@/trpc/react';

import Button from '../ui/Button';
import Foldable from '../ui/Foldable';
import MessageWrapper from '../ui/MessageWrapper';
import Spinner from '../ui/Spinner';

function SaleFoldable({ sports }: { sports: SaleCategory[] }) {
  const setSelected = useSetAtom(selectedCategoryAtom);
  const [activeSport, setActiveSport] = React.useState<number | null>(null);

  return (
    <>
      <div className={`flex flex-col gap-2 ${activeSport && 'hidden'}`}>
        {sports.map((sport) => (
          <Button key={sport.id} name={sport.name} className="z-50 w-full" onClick={() => setActiveSport(sport.id)}>
            {sport.name}
          </Button>
        ))}
        <Button name="Back" className="z-50 w-full" onClick={() => setSelected(null)}>
          <FaCaretLeft />
        </Button>
      </div>
      {activeSport && (
        <div className="flex flex-col gap-2">
          {sports
            .find((sport) => sport.id === activeSport)
            ?.categories.map((category) => (
              <Link key={category.id} href={`/sale/${activeSport}/${category.id}`} className="w-full">
                <Button name={category.name} className="z-50 w-full">
                  {category.name}
                </Button>
              </Link>
            ))}
          <Button name="Back" className="z-50" onClick={() => setActiveSport(null)}>
            <FaCaretLeft />
          </Button>
        </div>
      )}
    </>
  );
}

function SportsFoldable() {
  const setSelected = useSetAtom(selectedCategoryAtom);
  const [activeSport, setActiveSport] = React.useState<number | null>(null);
  const { data: sports, status } = api.category.getSports.useQuery();
  if (status === 'error') {
    return <MessageWrapper message="Unable to fetch sports at this time" popup={false} />;
  }
  if (status === 'pending') {
    return (
      <div className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-sm border border-slate-600/10 bg-slate-200/95 px-10 py-1 font-semibold text-nowrap whitespace-nowrap shadow-md backdrop-blur-sm transition duration-200 ease-in-out hover:bg-slate-300/80 xl:bg-slate-200/80 dark:border-slate-400/10 dark:bg-slate-800/95 dark:shadow-slate-500/10 dark:hover:bg-slate-700/80 xl:dark:bg-slate-800/80">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className={`flex flex-col gap-2 ${activeSport && 'hidden'}`}>
        {sports
          .filter((sport) => sport.products.length > 0)
          .map((sport) => (
            <Button key={sport.id} name={sport.name} className="z-50 w-full" onClick={() => setActiveSport(sport.id)}>
              {sport.name}
            </Button>
          ))}
        <Button name="Back" className="z-50 w-full" onClick={() => setSelected(null)}>
          <FaCaretLeft />
        </Button>
      </div>
      {activeSport && (
        <div className="flex flex-col gap-2">
          {sports
            .find((sport) => sport.id === activeSport)
            ?.categories.filter((category) => category.products.length > 0)
            .map((category) => (
              <Link key={category.id} href={`/sport/${activeSport}/${category.id}`} className="w-full">
                <Button name={category.name} className="z-50 w-full">
                  {category.name}
                </Button>
              </Link>
            ))}
          <Button name="Back" className="z-50" onClick={() => setActiveSport(null)}>
            <FaCaretLeft />
          </Button>
        </div>
      )}
    </>
  );
}

function GenderFoldable({ gender }: { gender: 'man' | 'woman' }) {
  const setSelected = useSetAtom(selectedCategoryAtom);
  const [activeCategory, setActiveCategory] = React.useState<number | null>(null);
  const { data: sports, status } = api.category.getSportsByGender.useQuery({
    gender: gender === 'man' ? 'MALE' : 'FEMALE',
  });
  if (status === 'error') {
    return <MessageWrapper message="Unable to fetch sports at this time" popup={false} />;
  }
  if (status === 'pending') {
    return (
      <div className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-sm border border-slate-600/10 bg-slate-200/95 px-10 py-1 font-semibold text-nowrap whitespace-nowrap shadow-md backdrop-blur-sm transition duration-200 ease-in-out hover:bg-slate-300/80 xl:bg-slate-200/80 dark:border-slate-400/10 dark:bg-slate-800/95 dark:shadow-slate-500/10 dark:hover:bg-slate-700/80 xl:dark:bg-slate-800/80">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div className={`flex flex-col gap-2 ${activeCategory ? 'hidden' : ''}`}>
        {sports
          .filter((sport) => sport.products.length > 0)
          .map((sport) => (
            <Button
              key={sport.id}
              name={sport.name}
              className="z-50 w-full"
              onClick={() => setActiveCategory(sport.id)}>
              {sport.name}
            </Button>
          ))}
        <Button name="Back" className="z-50 w-full" onClick={() => setSelected(null)}>
          <FaCaretLeft />
        </Button>
      </div>
      {activeCategory && (
        <div className="flex flex-col gap-2">
          {sports
            .find((sport) => sport.id === activeCategory)
            ?.categories.filter((category) => category.products.length > 0)
            .map((category) => (
              <Link
                key={category.id}
                href={`/sport/${activeCategory}/${category.id}?gender=${gender}`}
                className="w-full">
                <Button name={category.name} className="z-50 w-full">
                  {category.name}
                </Button>
              </Link>
            ))}
          <Button name="Back" className="z-50" onClick={() => setActiveCategory(null)}>
            <FaCaretLeft />
          </Button>
        </div>
      )}
    </>
  );
}

export default function CategoryFoldable() {
  const { data: sale } = api.category.getSportsInSale.useQuery();

  const [selected, setSelected] = useAtom(selectedCategoryAtom);

  // Reference to the foldable element for click outside detection
  const foldableRef = useRef<HTMLDivElement>(null);

  // Closes the foldable if a click occurs outside the menu
  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (foldableRef.current && !foldableRef.current.contains(event.target as Node)) {
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={foldableRef}>
      <Foldable
        button={{ name: 'Categories', text: <FaSearch size={20} />, className: 'px-[0.75rem] xl:px-10' }}
        addCaret={false}>
        {sale && (
          <Button
            name="Sale"
            className={`z-50 w-full overflow-hidden border-2 border-orange-500 dark:border-orange-500 ${selected ? 'hidden' : ''}`}
            disabled={selected ? true : false}
            onClick={() => setSelected('SALE')}>
            <p className="pointer-events-none absolute right-0 text-7xl opacity-10">%</p>
            {sale.name}
          </Button>
        )}
        <Button
          name="Sports"
          className={`z-50 w-full ${selected ? 'hidden' : ''}`}
          disabled={selected ? true : false}
          onClick={() => setSelected('SPORTS')}>
          Sports
        </Button>
        <Button
          name="Male"
          className={`z-50 w-full ${selected ? 'hidden' : ''}`}
          disabled={selected ? true : false}
          onClick={() => setSelected('MALE')}>
          Man
        </Button>
        <Button
          name="Female"
          className={`z-50 w-full ${selected ? 'hidden' : ''}`}
          disabled={selected ? true : false}
          onClick={() => setSelected('FEMALE')}>
          Woman
        </Button>
        {selected === 'SALE' && sale && <SaleFoldable sports={sale.sports} />}
        {selected === 'SPORTS' && <SportsFoldable />}
        {selected === 'MALE' && <GenderFoldable gender="man" />}
        {selected === 'FEMALE' && <GenderFoldable gender="woman" />}
      </Foldable>
    </div>
  );
}
