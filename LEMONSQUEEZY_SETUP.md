# Lemon Squeezy Integration Setup

This guide will help you complete the Lemon Squeezy payment integration for monthly subscriptions.

## Setup Steps

### 1. Create Products in Lemon Squeezy

1. Go to https://app.lemonsqueezy.com/products
2. Create two products:
   - **Pro Plan** - $4.99/month
   - **Creator Plan** - $14.99/month

3. For each product, note down the **Variant ID**:
   - Click on the product
   - Go to the "Variants" tab
   - Copy the variant ID (looks like: `123456`)

### 2. Get API Credentials

1. **API Key**:
   - Go to https://app.lemonsqueezy.com/settings/api
   - Create a new API key
   - Copy and save it (you won't be able to see it again!)

2. **Store ID**:
   - Go to https://app.lemonsqueezy.com/settings/stores
   - Copy your Store ID number

3. **Webhook Secret**:
   - Go to https://app.lemonsqueezy.com/settings/webhooks
   - Create a new webhook with URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
   - Select these events:
     - `subscription_created`
     - `subscription_updated`
     - `subscription_cancelled`
     - `subscription_expired`
     - `order_created`
   - Copy the "Signing Secret"

### 3. Update Environment Variables

Update your `.env` file with the actual values:

```env
# Lemon Squeezy Configuration
LEMONSQUEEZY_API_KEY=your_actual_api_key_here
LEMONSQUEEZY_STORE_ID=your_actual_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_actual_webhook_secret_here

# Lemon Squeezy Product Variant IDs
LEMONSQUEEZY_VARIANT_ID_PRO=your_pro_variant_id_here
LEMONSQUEEZY_VARIANT_ID_PREMIUM=your_creator_variant_id_here

# Your app URL (for redirects)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Run Database Migration

After updating the schema, run:

```bash
npx prisma generate
npx prisma db push
```

### 5. Test the Integration

1. Go to `/plans` page
2. Click on "Get Pro" or "Get Creator"
3. Complete the checkout (use Lemon Squeezy test mode)
4. Verify the webhook is triggered and user subscription is updated

## Payment Flow

1. **User clicks subscribe** → `/plans` page
2. **Creates checkout** → `/api/checkout` creates Lemon Squeezy checkout session
3. **User pays** → Redirected to Lemon Squeezy checkout
4. **Payment success** → Redirected back to dashboard
5. **Webhook triggered** → `/api/webhooks/lemonsqueezy` updates user subscription

## Testing

### Enable Test Mode

1. Go to https://app.lemonsqueezy.com/settings/general
2. Enable "Test Mode"
3. Create test products and get test API keys
4. Use test credit cards from Lemon Squeezy docs

### Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

## Troubleshoshot

### Checkout not working?

- Check your API key is correct
- Verify Store ID and Variant IDs are correct
- Check browser console for errors

### Webhooks not triggering?

- Verify webhook URL is accessible
- Check webhook secret is correct
- Look at Lemon Squeezy webhook logs

### Subscription not updating?

- Check webhook endpoint is working
- Verify database connection
- Check Prisma schema is migrated

## Next Steps

1. Update credit allocation based on subscription tier
2. Add subscription management page in dashboard
3. Implement usage limits based on plan
4. Add email notifications for subscription events

## Support

- Lemon Squeezy Docs: https://docs.lemonsqueezy.com
- Lemon Squeezy JS SDK: https://github.com/lmsqueezy/lemonsqueezy.js
