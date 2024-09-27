'use client';

import { env } from '@/env';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../_components/ui/Button';
import { api } from '@/trpc/react';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutButton() {
  const createCheckoutSession = api.checkout.createSession.useMutation({
    onSuccess: (data) => {
      return data;
    },
  });

  // Create and redirect to stripe checkout session
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const data = await createCheckoutSession.mutateAsync();
    if (stripe) {
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    }
  };
  // There will be a list of the products in the user's cart here, then handleCheckout will get that item data and send it to the server
  return <Button onClick={() => handleCheckout()}>Checkout</Button>;
}

export default CheckoutButton;
