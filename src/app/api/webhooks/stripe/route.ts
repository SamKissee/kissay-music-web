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
        const sessionEvent = event.data.object as Stripe.Checkout.Session;

        console.log('Payment successful for session:', sessionEvent.id);

        // Initialize Stripe client
        const stripe = new (await import('stripe')).default(
          process.env.STRIPE_SECRET_KEY!,
          { apiVersion: '2025-09-30.clover' }
        );

        // Fetch the full session with expanded line_items
        const session = await stripe.checkout.sessions.retrieve(
          sessionEvent.id,
          {
            expand: ['line_items.data.price.product'],
          }
        );

        // Extract order information
        const orderId = session.metadata?.order_id;
        const customerDetails = session.customer_details;
        const customerEmail = customerDetails?.email;
        const customerName = customerDetails?.name;
        const shippingAddress = customerDetails?.address;

        console.log('Extracted order info:', {
          orderId,
          customerEmail,
          customerName,
          shippingAddress,
        });

        if (!orderId || !customerEmail || !shippingAddress) {
          console.error('Missing required order information', {
            orderId,
            customerEmail,
            hasShippingAddress: !!shippingAddress,
          });
          break;
        }

        // Get line items from the expanded session
        const lineItems = session.line_items;

        // Build Printful order items
        const printfulItems = lineItems.data
          .filter((item) => {
            // Filter out shipping line items
            const product = item.price?.product as Stripe.Product;
            return product.name !== 'Shipping';
          })
          .map((item) => {
            const product = item.price?.product as Stripe.Product;
            const syncVariantId = product.metadata?.sync_variant_id;

            if (!syncVariantId) {
              throw new Error(`No sync_variant_id found for product ${product.id}`);
            }

            return {
              sync_variant_id: parseInt(syncVariantId),
              quantity: item.quantity || 1,
              retail_price: ((item.amount_total || 0) / 100).toFixed(2),
            };
          });

        // Create Printful order with customer details
        console.log('Creating Printful order with customer details:', {
          name: customerName,
          address: shippingAddress,
        });

        try {
          const printfulOrder = await createOrder({
            external_id: orderId,
            recipient: {
              name: customerName || 'Customer',
              address1: shippingAddress.line1 || '',
              city: shippingAddress.city || '',
              state_code: shippingAddress.state || undefined,
              country_code: shippingAddress.country || 'US',
              zip: shippingAddress.postal_code || '',
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

          // Only confirm orders in production (test orders stay as drafts)
          const isProduction = process.env.NODE_ENV === 'production';

          if (isProduction) {
            // Confirm the order to move it to fulfillment
            await confirmOrder(printfulOrder.id);
            console.log('Printful order confirmed and sent to fulfillment:', printfulOrder.id);
          } else {
            console.log('Printful order left as DRAFT (development mode):', printfulOrder.id);
            console.log('→ To fulfill this order, manually confirm it in the Printful dashboard');
          }
        } catch (printfulError) {
          console.error('Error creating Printful order:', printfulError);

          // Check if it's the "no print files" error
          if (printfulError instanceof Error && printfulError.message.includes('print files')) {
            console.error('⚠️  PRINTFUL SETUP REQUIRED:');
            console.error('   Your products need designs/artwork uploaded in Printful dashboard');
            console.error('   Go to: https://www.printful.com/dashboard/products');
            console.error('   Payment was successful - customer received confirmation');
            console.error(`   Order ID: ${orderId}`);
            console.error(`   Customer: ${customerEmail}`);
          }

          // Don't throw - payment was successful, just log the Printful issue
          // In production, you'd want to set up alerts for this
        }

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
