# Polar.sh Payment Integration Setup Guide

This guide will help you set up Polar.sh payments for your application.

## Prerequisites

1. Create a Polar.sh account at [polar.sh](https://polar.sh)
2. Create an organization in Polar
3. Create your products and pricing plans

## Step 1: Create Products in Polar

1. Go to your Polar dashboard
2. Navigate to Products
3. Create your subscription products (e.g., Pro, Creator)
4. Set up pricing for each product
5. Add benefits/features to each product

## Step 2: Get Your API Credentials

1. In your Polar dashboard, go to Settings → Developer
2. Create a new Organization Access Token (OAT)
3. Copy your Organization ID

## Step 3: Configure Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Polar.sh Configuration
POLAR_ACCESS_TOKEN=polar_oat_xxxxxxxxxxxxxxxxx
POLAR_ORGANIZATION_ID=your_org_id_here
POLAR_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: For development/testing
# POLAR_OAT_SANDBOX=polar_oat_sandbox_xxxxxxxxxxxxxxxxx

# App URL (required for redirects)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Step 4: Set Up Webhooks

1. In your Polar dashboard, go to Settings → Webhooks
2. Create a new webhook endpoint
3. Set the URL to: `https://yourdomain.com/api/webhooks/polar`
4. Select the following events:
   - `subscription.created`
   - `subscription.active`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.revoked`
5. Copy the webhook secret and add it to your `.env` file

## Step 5: Update Database Schema

Run the following command to apply the Polar.sh schema changes:

```bash
npm run db:push
```

This will add the following fields to your User table:
- `polarSubscriptionId`
- `polarCustomerId`

## Step 6: Test the Integration

### Test Checkout Flow
1. Start your development server: `npm run dev`
2. Navigate to `/plans`
3. Click on a paid plan
4. Complete the checkout process in Polar's test mode

### Test Webhooks
1. Use Polar's webhook testing tool in the dashboard
2. Send test webhook events
3. Verify the events are processed correctly in your application

## Step 7: Configure Products Mapping

The application automatically fetches products from Polar via the `/api/plans` endpoint. Make sure your products in Polar have:
- Clear names (e.g., "Free", "Pro", "Creator")
- Descriptions
- Pricing set up
- Benefits/features listed

## Step 8: Production Checklist

Before going live:

- [ ] Replace test API keys with production keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Configure production webhook endpoint
- [ ] Test full payment flow in production
- [ ] Set up proper error monitoring
- [ ] Review Polar's billing settings
- [ ] Test subscription cancellation flow
- [ ] Verify tax settings in Polar dashboard

## Customization

### Updating Tier Mapping

The webhook handler maps Polar subscriptions to user tiers. To customize this mapping, edit `/src/app/api/webhooks/polar/route.ts`:

```typescript
function getTierFromPriceId(priceId: string): "FREE" | "PRO" | "CREATOR" {
  // Add your custom logic here
}
```

### Customer Portal

Users can manage their subscriptions through Polar's customer portal:
- URL: `https://polar.sh/customer-portal`
- Automatically linked in the billing settings page

## Troubleshooting

### Common Issues

1. **Checkout fails**: Verify `POLAR_ACCESS_TOKEN` and `POLAR_ORGANIZATION_ID`
2. **Webhooks not received**: Check webhook URL and ensure it's publicly accessible
3. **User tier not updating**: Verify webhook events are being processed and price ID mapping is correct

### Debugging

Enable detailed logging by adding console logs in:
- `/src/app/api/checkout/route.ts` - Checkout creation
- `/src/app/api/webhooks/polar/route.ts` - Webhook processing
- `/src/app/api/plans/route.ts` - Plans fetching

## Resources

- [Polar.sh Documentation](https://polar.sh/docs)
- [Polar SDK for Node.js](https://www.npmjs.com/package/@polar-sh/sdk)
- [Polar Next.js Integration](https://polar.sh/docs/integrate/sdk/adapters/nextjs)
- [Polar API Reference](https://polar.sh/docs/api)

## Support

For issues with:
- Polar.sh platform: Contact Polar support
- Integration code: Check the troubleshooting section above
- Payment processing: Review Polar dashboard logs
