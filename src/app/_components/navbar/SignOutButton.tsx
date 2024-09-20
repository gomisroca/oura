'use client';

/**
 * Sign out button component.
 *
 * @example
 * <SignOutButton />
 */

import { signOut } from 'next-auth/react';
import Button from '../ui/Button';

function SignOutButton() {
  return (
    <Button name="Sign Out" onClick={() => signOut()}>
      <span>Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
