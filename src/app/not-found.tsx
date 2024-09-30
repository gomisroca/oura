'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MessageWrapper from './_components/ui/MessageWrapper';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MessageWrapper message="404 | Page Not Found" />;
}
