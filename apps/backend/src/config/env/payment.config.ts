import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  payhere: {
    merchantId: process.env.PAYHERE_MERCHANT_ID || '',
    merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || '',
    apiUrl: process.env.PAYHERE_API_URL || 'https://sandbox.payhere.lk/pay/checkout',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  ezcash: {
    merchantId: process.env.EZCASH_MERCHANT_ID || '',
    apiSecret: process.env.EZCASH_API_SECRET || '',
  },
}));
