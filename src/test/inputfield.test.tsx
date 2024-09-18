import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../app/_components/ui/InputField';
import { expect, vi } from 'vitest';

describe('InputField component', () => {
  it('renders with default props', () => {
    const handleValueChange = vi.fn();
    const { getByRole } = render(<InputField name="default-input" handleValueChange={handleValueChange} />);
    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveClass('w-full rounded-full px-4 py-2');
  });

  it('renders with custom type and placeholder', () => {
    const handleValueChange = vi.fn();
    const { getByRole } = render(
      <InputField name="custom-input" type="email" placeholder="Enter email" handleValueChange={handleValueChange} />
    );
    expect(getByRole('textbox')).toHaveAttribute('type', 'email');
    expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Enter email');
  });

  it('calls handleValueChange when input value changes', () => {
    const handleValueChange = vi.fn();
    const { getByRole } = render(<InputField name="change-input" handleValueChange={handleValueChange} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleValueChange).toHaveBeenCalledTimes(2);
    expect(handleValueChange).toHaveBeenNthCalledWith(2, 'new value');
  });
});
