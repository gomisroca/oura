'use client';

import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Foldable from '../ui/Foldable';
import Button from '../ui/Button';
import { FaCaretLeft } from 'react-icons/fa6';
import Link from 'next/link';
import { type SportWithCategories } from 'types';

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
      <div className={`flex flex-col gap-2 ${activeSport ? 'hidden' : ''}`}>
        {sports.map((sport: SportWithCategories) => (
          <Button
            key={sport.id}
            name={sport.name}
            className={`z-50 w-full ${activeSport ? 'hidden' : ''}`}
            disabled={activeSport ? true : false}
            onClick={() => setActiveSport(sport.id)}>
            {sport.name}
          </Button>
        ))}
        <Button name="Back" className={`z-50 w-full ${activeSport ? 'hidden' : ''}`} onClick={() => setSelected(null)}>
          <FaCaretLeft />
        </Button>
      </div>
      {activeSport && (
        <div className="flex flex-col gap-2">
          {sports
            .find((sport: SportWithCategories) => sport.id === activeSport)
            ?.categories.map((category) => (
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
        {sports.map((sport: SportWithCategories) => (
          <Button
            key={sport.id}
            name={sport.name}
            className={`z-50 w-full ${activeCategory ? 'hidden' : ''}`}
            disabled={activeCategory ? true : false}
            onClick={() => setActiveCategory(sport.id)}>
            {sport.name}
          </Button>
        ))}
        <Button
          name="Back"
          className={`z-50 w-full ${activeCategory ? 'hidden' : ''}`}
          onClick={() => setSelected(null)}>
          <FaCaretLeft />
        </Button>
      </div>
      {activeCategory && (
        <div className="flex flex-col gap-2">
          {sports
            .find((sport: SportWithCategories) => sport.id === activeCategory)
            ?.categories.map((category) => (
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
}: {
  sports: SportWithCategories[];
  maleSports: SportWithCategories[];
  femaleSports: SportWithCategories[];
}) {
  const [selected, setSelected] = React.useState<string | null>(null);

  // Reference to the foldable element for click outside detection
  const foldableRef = useRef<HTMLDivElement>(null);

  // Closes the foldable if a click occurs outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (foldableRef.current && !foldableRef.current.contains(event.target as Node)) {
      setSelected(null);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={foldableRef}>
      <Foldable
        button={{ name: 'Categories', text: <FaSearch size={20} />, className: 'px-[0.75rem] xl:px-10' }}
        addCaret={false}>
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
        {selected === 'SPORTS' && <SportsFoldable sports={sports} setSelected={setSelected} />}
        {selected === 'MALE' && <GenderFoldable gender="man" sports={maleSports} setSelected={setSelected} />}
        {selected === 'FEMALE' && <GenderFoldable gender="woman" sports={femaleSports} setSelected={setSelected} />}
      </Foldable>
    </div>
  );
}
