/**
 * Navbar component that displays the logo, sign in/out dropdown, and theme button.
 */

import React from 'react';
import Link from 'next/link';
import { MdOutlineSportsGymnastics, MdOutlineSportsMartialArts, MdSportsHandball } from 'react-icons/md';
import { GiRun, GiWeightLiftingUp, GiThrowingBall, GiHighPunch, GiHighKick } from 'react-icons/gi';
import { TbPlayFootball, TbPlayVolleyball } from 'react-icons/tb';
import Button from '../ui/Button';
import SportFoldable from './SportFoldable';
import SubcategoryFoldable from '../product/SubcategoryFoldable';
import GeneralMenuFoldable from './GeneralMenuFoldable';

const LogoIcons = () => {
  const icons = [
    <MdOutlineSportsGymnastics size={20} key="gymnastics" />,
    <MdOutlineSportsMartialArts size={20} key="martial" />,
    <MdSportsHandball size={20} key="handball" />,
    <GiRun size={20} key="run" />,
    <GiWeightLiftingUp size={20} key="lift" />,
    <GiThrowingBall size={20} key="throwball" />,
    <TbPlayVolleyball size={20} key="voleyball" />,
    <TbPlayFootball size={20} key="football" />,
    <GiHighPunch size={20} key="highpunch" />,
    <GiHighKick size={20} key="highkick" />,
  ];

  const textColors = [
    'text-red-500',
    'text-red-600',
    'text-red-700',
    'text-blue-500',
    'text-blue-600',
    'text-blue-700',
    'text-green-500',
    'text-green-600',
    'text-green-700',
    'text-yellow-500',
    'text-yellow-600',
    'text-yellow-700',
    'text-purple-500',
    'text-purple-600',
    'text-purple-700',
    'text-pink-500',
    'text-pink-600',
    'text-pink-700',
    'text-indigo-500',
    'text-indigo-600',
    'text-indigo-700',
    'text-teal-500',
    'text-teal-600',
    'text-teal-700',
    'text-orange-500',
    'text-orange-600',
    'text-orange-700',
    'text-lime-500',
    'text-lime-600',
    'text-lime-700',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-rose-500',
    'text-rose-600',
    'text-rose-700',
    'text-emerald-500',
    'text-emerald-600',
    'text-emerald-700',
    'text-violet-500',
    'text-violet-600',
    'text-violet-700',
    'text-cyan-500',
    'text-cyan-600',
    'text-cyan-700',
    'text-fuchsia-500',
    'text-fuchsia-600',
    'text-fuchsia-700',
  ];

  return (
    <Link href="/" aria-label="home">
      <Button name="Logo" className={textColors[Math.floor(Math.random() * textColors.length)] + ' px-5'}>
        <span>{icons[Math.floor(Math.random() * icons.length)]}</span>
        <span>oura</span>
      </Button>
    </Link>
  );
};

function Navbar() {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex flex-row items-start justify-between gap-4 p-4">
      <LogoIcons />
      <div className="relative flex flex-row items-start justify-end gap-2">
        <SubcategoryFoldable />
        <SportFoldable />
        <GeneralMenuFoldable />
      </div>
    </div>
  );
}

export default Navbar;
