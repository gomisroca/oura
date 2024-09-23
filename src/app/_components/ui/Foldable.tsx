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
  button?: {
    text: string | React.ReactNode;
    className?: string;
    name?: string;
  };
  addCaret?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Foldable({ button, addCaret = true, children, className }: FoldableProps) {
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
    <div className="relative flex flex-col items-end w-full" ref={foldableRef} data-testid="foldable">
      <Button 
      name={button?.name ?? 'Foldable Button'}
      className={`transition duration-200 ease-in-out ${isOpen ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''} ${button?.className ? button.className : ''}`}
      onClick={toggleOpen}
      >
        {button?.text}
        {addCaret && !isOpen ? <FaCaretDown size={20}  /> : addCaret ? <FaCaretUp size={20} /> : null}
      </Button>
      {isOpen && (
        <div 
        className={`absolute mt-14 items-end justify-center flex flex-col gap-2 ${className ? className : ''}`}>
          {React.Children.map(children, (child, index) => (
            <>
              {child}
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default Foldable;
