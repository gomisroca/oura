'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Cleanup the timeout on unmount to prevent memory leaks
    return () => clearTimeout(timeout);
  }, [router]);

  return <h1 className="text-center text-4xl font-bold">404 | Page Not Found</h1>;
}
