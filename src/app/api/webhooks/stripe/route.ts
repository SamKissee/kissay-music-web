import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
import { createOrder, confirmOrder } from '@/lib/printful';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 *
 * This webhook listens for successful payments and automatically
 * creates and confirms orders in Printful for fulfillment.
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          id: string;
          metadata?: { order_id?: string };
          customer_details?: { email?: string };
          shipping_details?: unknown;
          shipping?: unknown;
          amount_subtotal?: number;
        };

        console.log('Payment successful for session:', session.id);

        // Extract order information
        const orderId = session.metadata?.order_id;
        const customerEmail = session.customer_details?.email;
        const shippingDetails = session.shipping_details || session.shipping;

        if (!orderId || !customerEmail || !shippingDetails) {
          console.error('Missing required order information', {
            orderId,
            customerEmail,
            hasShipping: !!shippingDetails,
          });
          break;
        }

        // Fetch line items to get product details
        const stripe = new (await import('stripe')).default(
          process.env.STRIPE_SECRET_KEY!,
          { apiVersion: '2025-09-30.clover' }
        );

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { expand: ['data.price.product'] }
        );

        // Build Printful order items
        const printfulItems = lineItems.data
          .filter((item) => {
            // Filter out shipping line items
            const product = item.price?.product as Stripe.Product;
            return product.name !== 'Shipping';
          })
          .map((item) => {
            const product = item.price?.product as Stripe.Product;
            const variantId = product.metadata?.variant_id;

            if (!variantId) {
              throw new Error(`No variant_id found for product ${product.id}`);
            }

            return {
              variant_id: parseInt(variantId),
              quantity: item.quantity || 1,
              retail_price: ((item.amount_total || 0) / 100).toFixed(2),
            };
          });

        // Create Printful order
        const shipping = shippingDetails as {
          name?: string;
          address?: {
            line1?: string;
            city?: string;
            state?: string;
            country?: string;
            postal_code?: string;
          };
        };

        const printfulOrder = await createOrder({
          external_id: orderId,
          recipient: {
            name: shipping.name || 'Customer',
            address1: shipping.address?.line1 || '',
            city: shipping.address?.city || '',
            state_code: shipping.address?.state,
            country_code: shipping.address?.country || 'US',
            zip: shipping.address?.postal_code || '',
            email: customerEmail,
          },
          items: printfulItems,
          retail_costs: {
            currency: 'USD',
            subtotal: ((session.amount_subtotal || 0) / 100).toFixed(2),
            shipping: '8.95', // Match the shipping cost from checkout
          },
        });

        console.log('Printful order created:', printfulOrder.id);

        // Confirm the order to move it to fulfillment
        await confirmOrder(printfulOrder.id);

        console.log('Printful order confirmed:', printfulOrder.id);

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Webhook handler failed',
      },
      { status: 400 }
    );
  }
}

export const dynamic = 'force-dynamic';
