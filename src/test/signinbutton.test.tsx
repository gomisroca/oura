import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { signIn } from 'next-auth/react';
import SignInButton from '../app/_components/navbar/SignInButton';

// Mock the signIn function from next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Define a mock Provider type for the test
type Provider = {
  name: string;
  icon: React.ReactNode;
};

// Create mock providers for the test
const mockGoogleProvider: Provider = {
  name: 'google',
  icon: <span>Google Icon</span>,
};

const mockEmailProvider: Provider = {
  name: 'email',
  icon: <span>Email Icon</span>,
};

describe('SignInButton', () => {
  it('renders and calls signIn with Google provider', () => {
    render(<SignInButton provider={mockGoogleProvider} />);

    // Ensure the button for Google is rendered
    const button = screen.getByRole('button', { name: /google/i });
    expect(button).toBeInTheDocument();

    // Simulate clicking the button
    fireEvent.click(button);

    // Ensure signIn is called with 'google'
    expect(signIn).toHaveBeenCalledWith('google');
  });

  it('opens modal and handles email sign in', async () => {
    const signInMock = vi.fn();
    (signIn as jest.Mock).mockImplementation(signInMock);

    render(<SignInButton provider={mockEmailProvider} />);

    // Ensure the email modal button is rendered
    const emailButton = screen.getByRole('button', { name: /email modal/i });
    expect(emailButton).toBeInTheDocument();

    // Open the modal
    fireEvent.click(emailButton);

    // Ensure the modal content is rendered
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'email' })).toBeInTheDocument();

    // Simulate email input and submit
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'email' }));

    // Wait for the async signIn to complete
    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('email', { redirect: false, email: 'test@example.com' });
    });

    // Check that the email prompt appears
    expect(screen.getByText(/check your email for a sign in link/i)).toBeInTheDocument();
  });
});
