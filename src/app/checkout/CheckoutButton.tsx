'use client';

import { env } from '@/env';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../_components/ui/Button';
import { api } from '@/trpc/react';
import MessageWrapper from '../_components/ui/MessageWrapper';
import { useState } from 'react';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutButton() {
  const [error, setError] = useState(false);

  const createCheckoutSession = api.checkout.createSession.useMutation({
    onSuccess: (data) => {
      return data;
    },
    onError: (_error) => {
      setError(true);
    },
  });

  // Create and redirect to stripe checkout session
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const data = await createCheckoutSession.mutateAsync();
      if (stripe && data) {
        await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
      } else {
        throw new Error('Unable to create checkout session');
      }
    } catch (_error) {
      setError(true);
    }
  };
  return (
    <>
      {error && <MessageWrapper message="Error creating checkout session" popup={true} />}
      <Button onClick={() => handleCheckout()}>Checkout</Button>
    </>
  );
}

export default CheckoutButton;
