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
    className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" 
    onClick={onClose} 
    role="dialog"
    aria-label='modal-title'>
      <div
        className="rounded-md bg-slate-200/30 dark:bg-slate-800/30 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 backdrop-blur-sm p-6 shadow-md relative w-full"
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