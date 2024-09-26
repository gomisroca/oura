'use client';

import { env } from '@/env';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../_components/ui/Button';
import { api } from '@/trpc/react';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function Checkout() {
  const createCheckoutSession = api.checkout.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      return data;
    },
  });

  // Create and redirect to stripe checkout session
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const data = await createCheckoutSession.mutateAsync({
      items: [
        {
          name: 'White T-Shirt',
          price: 20.99,
          productId: '600fb1ad-e1b3-410b-84b8-3a8c3b95bd94',
          sizeId: 'cm1bzye1q00085moxpiv6ynd3',
          colorId: 'cm1bzye88000a5moxl44gr2ny',
        },
      ],
    });
    if (stripe) {
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    }
  };
  // There will be a list of the products in the user's cart here, then handleCheckout will get that item data and send it to the server
  return <Button onClick={handleCheckout}>Checkout</Button>;
}

export default Checkout;
