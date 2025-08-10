/**
 * Modal component that displays a modal dialog when clicked.
 *
 * @param {{ isOpen: boolean; onClose: () => void; children: ReactNode; }} props - The props for the Modal component.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <h1>Modal Content</h1>
 * </Modal>
 */

import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
    onClick={onClose} 
    role="dialog"
    aria-label='modal-title'>
      <div
        className="rounded-sm absolute w-72 bg-neutral-200/30 dark:bg-neutral-800/30 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 backdrop-blur-sm p-6 shadow-md dark:shadow-neutral-500/10 gap-2 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal