'use client';

/**
 * Sign in button component.
 *
 * @param provider - The provider to sign in with.
 *
 * @example
 * <SignInButton provider={Provider.Google} />
 */

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import InputField from './ui/InputField';
import Button from './ui/Button';
import Modal from './ui/Modal';

function EmailSignInButton({ provider }: { provider: Provider }) {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkEmailPrompt, setCheckEmailPrompt] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSignIn = async () => {
    await signIn('email', { redirect: false, email: email });
    setCheckEmailPrompt(true);
    setTimeout(() => {
      setCheckEmailPrompt(false);
      closeModal();
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button name="email-modal-open" onClick={openModal}>
        {provider.icon} Email
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <InputField name="email" placeholder="Email" handleValueChange={(value: string) => setEmail(value)} />
        <Button name="email-signin" onClick={() => handleSignIn()}>
          Sign In
        </Button>
        {checkEmailPrompt && (
          <div className="text-center text-sm text-slate-800 dark:text-slate-200">
            Check your email for a sign in link.
          </div>
        )}
      </Modal>
    </div>
  );
}

function SignInButton({ provider }: { provider: Provider }) {
  return provider.name !== 'email' ? (
    <Button name="signin" onClick={() => signIn(provider.name)}>
      <span>{provider.icon}</span>
      <span>{provider.name[0]!.toUpperCase() + provider.name.slice(1)}</span>
    </Button>
  ) : (
    <EmailSignInButton provider={provider} />
  );
}

export default SignInButton;
