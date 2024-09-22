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
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { type Provider } from 'types';

function EmailSignInButton({ provider }: { provider: Provider }) {
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    setPrompt(null);
    e.preventDefault();
    const res = await signIn('email', { redirect: false, email: email });
    if (res?.error) {
      setPrompt(res.error);
    }
    setPrompt('Check your email for a sign in link.');
    setTimeout(() => {
      setPrompt(null);
      closeModal();
    }, 5000);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Button name="Email Modal" className="w-full" onClick={openModal}>
        {provider.icon} Email
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form onSubmit={(e) => handleSignIn(e)} className="flex flex-col gap-2">
          <InputField
            name="email"
            placeholder="Email"
            handleValueChange={(value: string) => setEmail(value)}
            type="email"
            required
          />
          <Button type="submit" name="email">
            Sign In
          </Button>
          {prompt && <div className="text-center text-sm text-slate-800 dark:text-slate-200">{prompt}</div>}
        </form>
      </Modal>
    </div>
  );
}

function SignInButton({ provider }: { provider: Provider }) {
  return provider.name !== 'email' ? (
    <Button name={provider.name} onClick={() => signIn(provider.name)}>
      <span>{provider.icon}</span>
      <span>{provider.name[0]!.toUpperCase() + provider.name.slice(1)}</span>
    </Button>
  ) : (
    <EmailSignInButton provider={provider} />
  );
}

export default SignInButton;
