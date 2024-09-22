'use client';

import { type Category, type Sport } from '@prisma/client';
import { api } from '@/trpc/react';
import React, { useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Foldable from '../ui/Foldable';
import Button from '../ui/Button';
import { FaCaretLeft } from 'react-icons/fa6';
import Link from 'next/link';

interface SportWithCategories extends Sport {
  categories: Category[];
}

function SportFoldable() {
  const sports = api.category.getSports.useQuery();
  const [activeSport, setActiveSport] = React.useState<string | null>(null);

  // Reference to the foldable element for click outside detection
  const foldableRef = useRef<HTMLDivElement>(null);

  // Closes the foldable if a click occurs outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (foldableRef.current && !foldableRef.current.contains(event.target as Node)) {
      setActiveSport(null);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={foldableRef} className="absolute right-20 xl:right-32">
      <Foldable button={{ name: 'Sports', text: <FaSearch size={20} />, className: 'px-4 xl:px-10' }} addCaret={false}>
        {sports &&
          sports.data?.map((sport: SportWithCategories) => (
            <Button
              key={sport.id}
              name={sport.name}
              className={`z-50 w-full ${activeSport ? 'hidden' : ''}`}
              disabled={activeSport ? true : false}
              onClick={() => setActiveSport(sport.id)}>
              {sport.name}
            </Button>
          ))}
        {activeSport && (
          <div className="flex flex-col gap-2">
            {sports.data
              ?.find((sport: SportWithCategories) => sport.id === activeSport)
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
      </Foldable>
    </div>
  );
}

export default SportFoldable;
