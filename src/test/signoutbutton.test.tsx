import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { signOut } from 'next-auth/react';
import SignOutButton from '../app/_components/navbar/SignOutButton';

// Mock the signOut function from next-auth/react
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('Sign Out Button', () => {
  it('renders the sign out button', () => {
    render(<SignOutButton />);

    // Ensure the button is rendered
    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut when the button is clicked', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /sign out/i });

    // Simulate clicking the button
    fireEvent.click(button);

    // Check if signOut was called
    expect(signOut).toHaveBeenCalled();
  });
});
