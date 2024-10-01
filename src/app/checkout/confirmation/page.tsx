'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import Spinner from '@/app/_components/ui/Spinner';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function CheckoutConfirmation({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const router = useRouter();
  const [message, setMessage] = useState({ error: true, message: '' });
  const [success, setSuccess] = useState(false);

  // Check the session and order details with the server
  const confirmOrder = api.checkout.confirmOrder.useMutation({
    onSuccess: () => {
      handleRedirect();
      setMessage({ error: false, message: 'You should be redirected momentarily' });
      setSuccess(true);
    },
    onError: (error) => {
      setMessage({ error: true, message: `Unable to confirm order at this time: ${error.message}` });
    },
  });

  // If the order is confirmed, redirect to the success page
  const handleRedirect = () => {
    router.push(`/checkout/success?orderId=${searchParams?.orderId}`);
  };

  // If the sessionId and orderId are in the URL, call the mutation to confirm the order, otherwise set a message and show a button to go back to the home page
  useEffect(() => {
    if (searchParams?.sessionId && searchParams?.orderId) {
      confirmOrder.mutate({ sessionId: searchParams.sessionId, orderId: searchParams.orderId });
    } else {
      setMessage({ error: true, message: 'Missing Order or Session ID' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-5">
      {!success && !message && <Spinner />}
      {message && <MessageWrapper error={message.error} message={message.message} popup={false} />}
      {!success && message && <Button onClick={() => router.push('/')}>Home</Button>}
      {success && <Button onClick={handleRedirect}>Go forward</Button>}
    </div>
  );
}

export default CheckoutConfirmation;
