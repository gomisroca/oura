import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Modal from '../app/_components/ui/Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <h1>Modal Content</h1>
      </Modal>
    );

    // Ensure the modal is not in the document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <h1>Modal Content</h1>
      </Modal>
    );

    // Ensure the modal and content are in the document
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('closes the modal when clicking the overlay', () => {
    const onCloseMock = vi.fn();
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <h1>Modal Content</h1>
      </Modal>
    );

    // Click on the overlay (background)
    fireEvent.click(screen.getByRole('dialog'));

    // Ensure onClose is called
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('does not close the modal when clicking inside the modal content', () => {
    const onCloseMock = vi.fn();
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <h1>Modal Content</h1>
      </Modal>
    );

    // Click inside the modal content
    fireEvent.click(screen.getByText('Modal Content'));

    // Ensure onClose is not called
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('closes the modal when clicking the close button', () => {
    const onCloseMock = vi.fn();
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <h1>Modal Content</h1>
      </Modal>
    );

    // Click the close button
    fireEvent.click(screen.getByRole('button'));

    // Ensure onClose is called
    expect(onCloseMock).toHaveBeenCalled();
  });
});
