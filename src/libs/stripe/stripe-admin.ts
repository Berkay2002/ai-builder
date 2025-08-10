import Stripe from 'stripe';

import { getEnvVar } from '@/utils/get-env-var';

let cachedStripe: Stripe | null = null;

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeAdmin(): Stripe {
  if (cachedStripe) return cachedStripe;
  const secretKey = getEnvVar(process.env.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY');
  cachedStripe = new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    appInfo: {
      name: '{{STRIPE_APP_NAME}}',
      version: '0.1.0',
    },
  });
  return cachedStripe;
}
