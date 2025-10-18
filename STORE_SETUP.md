# Printful E-Commerce Store Setup Guide

## Overview

Your Kissay Music website now includes a fully-integrated e-commerce store powered by:
- **Printful** - Print-on-demand fulfillment and product catalog
- **Stripe** - Secure payment processing
- **Next.js 15 API Routes** - Backend logic
- **Zustand** - Shopping cart state management

## Features

✅ Product catalog from Printful
✅ Shopping cart with persistent storage
✅ Secure checkout with Stripe
✅ Automatic order fulfillment via Printful
✅ Order tracking system
✅ Mobile-responsive design
✅ SEO-optimized store pages

## Setup Steps

### 1. Printful Account Setup

1. **Create a Printful Account**
   - Visit [https://www.printful.com](https://www.printful.com)
   - Sign up for a free account

2. **Create a Store**
   - Go to Settings > Stores
   - Click "Add new store"
   - Select "Manual order platform / API"
   - Name it "Kissay Music Website" or similar

3. **Get Your API Key**
   - Go to Settings > Stores
   - Click on your store
   - Navigate to the "API" tab
   - Click "Enable API Access"
   - Copy your **Private Access Token**

4. **Create Products**
   - Go to "Product templates"
   - Click "Add product"
   - Choose your product types (t-shirts, hoodies, etc.)
   - Upload your designs
   - Set retail prices (your customer pays)
   - Printful automatically deducts their cost + shipping

### 2. Stripe Account Setup

1. **Create a Stripe Account**
   - Visit [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Complete the signup process

2. **Get Your API Keys**
   - Go to Developers > API Keys
   - Copy your **Publishable key** (starts with `pk_`)
   - Copy your **Secret key** (starts with `sk_`)
   - **Important**: Use test keys first (`pk_test_` and `sk_test_`)

3. **Set Up Webhooks**
   - Go to Developers > Webhooks
   - Click "+ Add endpoint"
   - Enter your webhook URL:
     ```
     https://yourdomain.com/api/webhooks/stripe
     ```
   - Select events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Copy the **Signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

Update your `.env.local` file with your API keys:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://kissaymusic.com

# Printful API (from Printful Dashboard > Settings > Stores > API)
PRINTFUL_API_KEY=your-printful-private-token-here

# Stripe (from Stripe Dashboard > Developers > API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Stripe Webhooks (from Stripe Dashboard > Developers > Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Security Notes:**
- Never commit `.env.local` to git (it's in `.gitignore`)
- Use test keys during development
- Switch to live keys only when ready to accept real payments

### 4. Deploy and Test

#### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000/store
```

#### Deploy to Production

1. Deploy to Vercel/Netlify/your hosting provider
2. Add environment variables in your hosting dashboard
3. Update the Stripe webhook URL to your production domain
4. Test with Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - Any future expiry date and CVC

### 5. Test the Complete Flow

1. **Browse Products**: Visit `/store`
2. **Add to Cart**: Select a product and add it
3. **Checkout**: Go to cart and enter email
4. **Payment**: Use Stripe test card `4242 4242 4242 4242`
5. **Verify**:
   - Check Stripe dashboard for payment
   - Check Printful for order creation
   - Order should auto-confirm for fulfillment

## Store Pages

### Main Store Pages

- **[/store](src/app/store/page.tsx)** - Product catalog
- **[/store/products/[id]](src/app/store/products/[id]/page.tsx)** - Product detail with variants
- **[/store/cart](src/app/store/cart/page.tsx)** - Shopping cart
- **[/store/success](src/app/store/success/page.tsx)** - Order confirmation
- **[/store/track](src/app/store/track/page.tsx)** - Order tracking

### API Routes

- **[/api/store/products](src/app/api/store/products/route.ts)** - Get all products
- **[/api/store/products/[id]](src/app/api/store/products/[id]/route.ts)** - Get single product
- **[/api/store/checkout](src/app/api/store/checkout/route.ts)** - Create checkout session
- **[/api/store/orders/[id]](src/app/api/store/orders/[id]/route.ts)** - Get order status
- **[/api/webhooks/stripe](src/app/api/webhooks/stripe/route.ts)** - Handle Stripe events

## How It Works

### Purchase Flow

1. **Customer browses products**
   - Products are fetched from Printful API
   - Displayed with images, variants (sizes/colors), and prices

2. **Customer adds items to cart**
   - Cart is managed by Zustand (persisted in localStorage)
   - Shows real-time totals

3. **Customer checks out**
   - Stripe Checkout session is created
   - Prices are verified against Printful to prevent manipulation
   - Customer redirected to Stripe's secure payment page

4. **Payment processed**
   - Stripe processes payment
   - Webhook notification sent to `/api/webhooks/stripe`

5. **Order fulfillment**
   - Webhook receives `checkout.session.completed` event
   - Creates order in Printful with customer details
   - Confirms order for automatic fulfillment
   - Printful prints, packs, and ships the product

6. **Customer receives tracking**
   - Printful sends tracking info when shipped
   - Customer can track order at `/store/track`

### Security Features

✅ **Price verification** - Prices fetched from Printful API at checkout
✅ **Webhook signature verification** - Validates Stripe webhooks
✅ **Environment variables** - Sensitive keys never exposed
✅ **HTTPS required** - Stripe requires SSL in production
✅ **Input validation** - All user inputs sanitized
✅ **Rate limiting** - Prevents abuse (built into Printful/Stripe)

## Customization

### Shipping Costs

Default is $8.95 flat rate. Update in:
- [src/app/store/cart/page.tsx](src/app/store/cart/page.tsx) - Line 12
- [src/app/api/store/checkout/route.ts](src/app/api/store/checkout/route.ts) - Line 49
- [src/app/api/webhooks/stripe/route.ts](src/app/api/webhooks/stripe/route.ts) - Line 127

You can implement dynamic shipping by using Printful's shipping rate API.

### Styling

All store pages use your existing design system:
- Tailwind CSS classes
- Background images
- Bottom navigation
- Consistent typography

### Product Display

Products automatically use:
- Thumbnail images from Printful
- Preview images for variants
- Variant names (parsed for size/color)

## Troubleshooting

### Products not loading

```bash
# Check Printful API key
echo $PRINTFUL_API_KEY

# Check API response
curl -H "Authorization: Bearer YOUR_KEY" \
  https://api.printful.com/store/products
```

### Checkout not working

1. Check Stripe publishable key is set
2. Verify it starts with `pk_`
3. Check browser console for errors
4. Ensure HTTPS in production

### Orders not creating in Printful

1. Check webhook is configured in Stripe
2. Verify webhook secret matches `.env.local`
3. Check Stripe webhook logs for errors
4. Ensure Printful API key has write permissions

### Common Errors

**"PRINTFUL_API_KEY is not set"**
- Add key to `.env.local`
- Restart dev server

**"STRIPE_SECRET_KEY is not set"**
- Add key to `.env.local`
- Restart dev server

**"Failed to create order"**
- Check Printful products are published
- Verify variant IDs exist
- Check API key permissions

## Going Live

### Pre-Launch Checklist

- [ ] Switch to Stripe live keys (`pk_live_`, `sk_live_`)
- [ ] Update webhook URL to production domain
- [ ] Test complete purchase flow
- [ ] Verify Printful order creation
- [ ] Test order tracking
- [ ] Set up Stripe email notifications
- [ ] Add your business details to Stripe account
- [ ] Enable Stripe tax collection (if required)
- [ ] Set up proper error monitoring (Sentry, etc.)

### Post-Launch

- Monitor Stripe dashboard for payments
- Monitor Printful for order fulfillment
- Check webhook logs regularly
- Set up alerts for failed webhooks

## Support & Resources

### Documentation

- [Printful API Docs](https://developers.printful.com/docs/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Test Cards

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155
- Any future expiry, any 3-digit CVC

### Getting Help

- **Stripe Issues**: [https://support.stripe.com](https://support.stripe.com)
- **Printful Issues**: [https://www.printful.com/help](https://www.printful.com/help)
- **Code Issues**: Check build logs and API responses

## File Structure

```
src/
├── app/
│   ├── store/
│   │   ├── page.tsx              # Product catalog
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart
│   │   ├── products/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── success/
│   │   │   └── page.tsx          # Order confirmation
│   │   └── track/
│   │       └── page.tsx          # Order tracking
│   └── api/
│       ├── store/
│       │   ├── products/
│       │   │   ├── route.ts      # List products
│       │   │   └── [id]/
│       │   │       └── route.ts  # Get product
│       │   ├── checkout/
│       │   │   └── route.ts      # Create checkout
│       │   └── orders/
│       │       └── [id]/
│       │           └── route.ts  # Get order
│       └── webhooks/
│           └── stripe/
│               └── route.ts      # Stripe webhook handler
├── lib/
│   ├── printful.ts               # Printful API client
│   └── stripe.ts                 # Stripe API client
└── store/
    └── cartStore.ts              # Shopping cart state
```

## Next Steps

1. **Add More Products** - Create more designs in Printful
2. **Marketing** - Promote your store on social media
3. **Analytics** - Add Google Analytics to track conversions
4. **Email** - Set up automated order confirmation emails
5. **Discounts** - Implement promo codes via Stripe

---

**Built with love for Kissay Music** 🎵
Questions? Check the docs or reach out to your developer.
