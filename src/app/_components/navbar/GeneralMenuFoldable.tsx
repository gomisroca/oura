import React from 'react';
import UserDropdown from './UserDropdown';
import { FaBars } from 'react-icons/fa6';
import ThemeButton from './ThemeButton';
import Foldable from '../ui/Foldable';

function GeneralMenuFoldable() {
  return (
    <Foldable
      button={{ name: 'General Menu', text: <FaBars size={20} />, className: 'px-[0.75rem] xl:px-10' }}
      addCaret={false}>
      <UserDropdown />
      <ThemeButton />
    </Foldable>
  );
}

export default GeneralMenuFoldable;
