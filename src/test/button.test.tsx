import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';
import { expect, vi } from 'vitest';

import Button from '../app/_components/ui/Button';

describe('Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Button name="default-button">Click me</Button>);
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('button')).toHaveClass(
      'justify-center cursor-pointer whitespace-nowrap text-nowrap duration-100 ease-in rounded-sm hover:scale-110 bg-neutral-100 active:scale-90 dark:bg-neutral-800 backdrop-blur-sm dark:shadow-neutral-500/10 dark:hover:bg-neutral-900 px-10 py-3 shadow-md font-semibold transition hover:bg-neutral-200 active:duration-100 active:bg-neutral-300 dark:active:bg-neutral-950 flex flex-row gap-2 items-center'
    );
  });

  it('renders with custom className', () => {
    const { getByRole } = render(
      <Button name="custom-button" className="custom-class">
        Click me
      </Button>
    );
    expect(getByRole('button')).toHaveClass('custom-class');
  });

  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <Button name="click-button" onClick={onClick}>
        Click me
      </Button>
    );
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(
      <Button name="disabled-button" disabled={true}>
        Click me
      </Button>
    );
    expect(getByRole('button')).toBeDisabled();
  });

  it('renders children', () => {
    const { getByText } = render(
      <Button name="children-button">
        Click <span>me</span>
      </Button>
    );
    expect(getByText('me')).toBeInTheDocument();
  });
});
