'use client';

import { env } from '@/env';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../_components/ui/Button';
import { api } from '@/trpc/react';
import MessageWrapper from '../_components/ui/MessageWrapper';
import { useState } from 'react';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
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
  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const stripe = await stripePromise;
      const data = await createCheckoutSession.mutateAsync({ name, street, postalCode, country });
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
      <form onSubmit={(e) => handleCheckout(e)} className="flex flex-col gap-2">
        <input
          className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="street"
          type="text"
          placeholder="Street Name and Number"
          onChange={(e) => setStreet(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="postalCode"
          type="text"
          placeholder="Postal Code"
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="country"
          type="text"
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {error && <MessageWrapper message="Error creating checkout session" popup={true} />}
        <Button type="submit">Checkout</Button>
      </form>
    </>
  );
}

export default CheckoutForm;
