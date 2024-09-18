'use client';

/**
 * Sign in button component.
 *
 * @param provider - The provider to sign in with.
 *
 * @example
 * <SignInButton provider={Provider.Google} />
 */

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import InputField from './ui/InputField';
import Button from './ui/Button';

function SignInButton({ provider }: { provider: Provider }) {
  const [email, setEmail] = useState('');

  return provider.name !== 'email' ? (
    <Button name="signin" onClick={() => signIn(provider.name)}>
      <span>{provider.icon}</span>
      <span>{provider.name[0]!.toUpperCase() + provider.name.slice(1)}</span>
    </Button>
  ) : (
    <div className="flex flex-col items-center gap-2">
      <InputField name="email" placeholder="Email" handleValueChange={(value: string) => setEmail(value)} />
      <Button name="email-signin" onClick={() => signIn('email', { redirect: false, email: email })}>
        {provider.icon} Email
      </Button>
    </div>
  );
}

export default SignInButton;
