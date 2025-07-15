import React from 'react';
import { FaBars } from 'react-icons/fa6';

import Foldable from '../ui/Foldable';
import ThemeButton from './ThemeButton';
import UserDropdown from './UserDropdown';

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
