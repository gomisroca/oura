'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageWrapper from './_components/ui/MessageWrapper';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Cleanup the timeout on unmount to prevent memory leaks
    return () => clearTimeout(timeout);
  }, [router]);

  return <MessageWrapper message="404 | Page Not Found" />;
}
