import SignInButton from '../app/_components/SignInButton';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { FaGoogle } from 'react-icons/fa6';
import { expect } from 'vitest';

describe('SignInButton component', () => {
  it('renders sign in button with provider icon and name', () => {
    const provider = { name: 'google', icon: <FaGoogle /> };
    const { getByRole } = render(<SignInButton provider={provider} />);
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('button')).toContainHTML('svg');
    expect(getByRole('button')).toHaveTextContent(provider.name[0]!.toUpperCase() + provider.name.slice(1));
  });

  it('renders email input field and sign in button for email provider', () => {
    const provider = { name: 'email', icon: <FaGoogle /> };
    const { getByRole } = render(<SignInButton provider={provider} />);
    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent('Email');
  });
});
