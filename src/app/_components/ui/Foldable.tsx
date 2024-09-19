'use client';	

/**
 * Foldable component that displays a button and its children when clicked.
 *
 * @param {{ children: React.ReactNode; }} props - The props for the Foldable component.
 *
 * @example
 * <Foldable>
 *   <Button name="Home">Home</Button>
 *   <Button name="About">About</Button>
 *   <Button name="Contact">Contact</Button>
 * </Foldable>
 */

import React, { useEffect, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Button from './Button';

interface FoldableProps {
  children: React.ReactNode;
}

function Foldable({ children }: FoldableProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Reference to the foldable element for click outside detection
  const foldableRef = useRef<HTMLDivElement>(null);

  // Closes the foldable if a click occurs outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (foldableRef.current && !foldableRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={foldableRef} data-testid="foldable">
      <Button name="Foldable" onClick={toggleOpen}>
        {!isOpen ? <FaCaretDown size={20}  /> : <FaCaretUp size={20} />}
      </Button>
      {isOpen && (
        <div 
        className="mt-2 items-center justify-center flex flex-col gap-2">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="flex">
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Foldable;
