import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getProductVariant } from '@/lib/printful';

/**
 * POST /api/store/checkout
 * Create a Stripe checkout session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail } = body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid items' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Fetch current prices from Printful to prevent price manipulation
    const lineItems = await Promise.all(
      items.map(async (item: { variantId: number; quantity: number }) => {
        const variant = await getProductVariant(item.variantId);

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        // Convert retail price to cents
        const price = Math.round(parseFloat(variant.retail_price) * 100);

        return {
          name: variant.name,
          description: `${variant.product.name}`,
          price,
          quantity: item.quantity,
          images: variant.product.image ? [variant.product.image] : [],
          variant_id: variant.variant_id,
        };
      })
    );

    // Calculate shipping (simplified - you may want more complex logic)
    const shippingCost = 895; // $8.95 flat rate shipping in cents

    // Generate unique order ID
    const orderId = `KISSAY-${Date.now()}`;

    // Create Stripe checkout session
    const session = await createCheckoutSession(
      lineItems,
      shippingCost,
      {
        orderId,
        customerEmail,
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error in /api/store/checkout:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
