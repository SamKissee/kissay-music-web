import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/printful';

/**
 * GET /api/store/orders/[id]
 * Get order details and tracking information
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate order ID format
    if (!id || id.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await getOrder(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Return order details with tracking information
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        external_id: order.external_id,
        status: order.status,
        created: order.created,
        updated: order.updated,
        recipient: {
          name: order.recipient.name,
          city: order.recipient.city,
          state: order.recipient.state_code,
          country: order.recipient.country_code,
        },
        items: order.items.map((item: {
          name: string;
          quantity: number;
          retail_price: string;
          product: { image: string };
        }) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.retail_price,
          image: item.product.image,
        })),
        shipments: order.shipments.map((shipment: {
          carrier: string;
          service: string;
          tracking_number: string;
          tracking_url: string;
          ship_date: string;
          shipped_at?: number;
        }) => ({
          carrier: shipment.carrier,
          service: shipment.service,
          tracking_number: shipment.tracking_number,
          tracking_url: shipment.tracking_url,
          ship_date: shipment.ship_date,
          status: shipment.shipped_at ? 'Shipped' : 'Processing',
        })),
      },
    });
  } catch (error) {
    console.error('Error in /api/store/orders/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
