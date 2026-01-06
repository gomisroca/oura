'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

import { env } from '@/env';
import { api } from '@/trpc/react';

import Button from '../_components/ui/Button';
import MessageWrapper from '../_components/ui/MessageWrapper';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    name: '',
    street: '',
    postalCode: '',
    country: '',
  });

  const createCheckoutSession = api.checkout.createSession.useMutation({
    onSuccess: (data) => {
      return data;
    },
    onError: (_error) => {
      setError(true);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create and redirect to stripe checkout session
  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await createCheckoutSession.mutateAsync(form);

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Unable to get checkout URL');
      }
    } catch (_error) {
      setError(true);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handleCheckout(e)} className="flex flex-col gap-2">
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="street"
          type="text"
          placeholder="Street Name and Number"
          onChange={handleChange}
          required
        />

        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="postalCode"
          type="text"
          placeholder="Postal Code"
          onChange={handleChange}
          required
        />

        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="country"
          type="text"
          placeholder="Country"
          onChange={handleChange}
          required
        />
        {error && <MessageWrapper message="Error creating checkout session" popup={true} />}
        <Button type="submit">Checkout</Button>
      </form>
    </>
  );
}

export default CheckoutForm;
