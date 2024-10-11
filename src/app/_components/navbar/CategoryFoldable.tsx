'use client';

import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Foldable from '../ui/Foldable';
import Button from '../ui/Button';
import { FaCaretLeft } from 'react-icons/fa6';
import Link from 'next/link';
import { type SaleCategory, type SportWithCategories } from 'types';

function SaleFoldable({
  sports,
  setSelected,
}: {
  sports: SaleCategory[];
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}) {
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

function SportsFoldable({
  sports,
  setSelected,
}: {
  sports: SportWithCategories[];
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [activeSport, setActiveSport] = React.useState<number | null>(null);

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

function GenderFoldable({
  gender,
  sports,
  setSelected,
}: {
  gender: 'man' | 'woman';
  sports: SportWithCategories[];
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [activeCategory, setActiveCategory] = React.useState<number | null>(null);

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

export default function CategoryFoldable({
  sports,
  maleSports,
  femaleSports,
  saleName,
  saleSports,
}: {
  sports: SportWithCategories[];
  maleSports: SportWithCategories[];
  femaleSports: SportWithCategories[];
  saleName?: string;
  saleSports?: SaleCategory[];
}) {
  const [selected, setSelected] = React.useState<string | null>(null);

  // Reference to the foldable element for click outside detection
  const foldableRef = useRef<HTMLDivElement>(null);

  // Closes the foldable if a click occurs outside the menu
  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (foldableRef.current && !foldableRef.current.contains(event.target as Node)) {
      setSelected(null);
    }
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
        {saleName && saleSports && (
          <Button
            name="Sale"
            className={`z-50 w-full overflow-hidden border-2 border-orange-500 dark:border-orange-500 ${selected ? 'hidden' : ''}`}
            disabled={selected ? true : false}
            onClick={() => setSelected('SALE')}>
            <p className="pointer-events-none absolute right-0 text-7xl opacity-10">%</p>
            {saleName}
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
        {selected === 'SALE' && saleSports && <SaleFoldable sports={saleSports} setSelected={setSelected} />}
        {selected === 'SPORTS' && <SportsFoldable sports={sports} setSelected={setSelected} />}
        {selected === 'MALE' && <GenderFoldable gender="man" sports={maleSports} setSelected={setSelected} />}
        {selected === 'FEMALE' && <GenderFoldable gender="woman" sports={femaleSports} setSelected={setSelected} />}
      </Foldable>
    </div>
  );
}
