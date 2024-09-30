'use client';

import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Error() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MessageWrapper message="Something went wrong" />;
}

export default Error;
