import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/printful';

/**
 * GET /api/store/products
 * Fetch all products from Printful store
 */
export async function GET() {
  try {
    const products = await getStoreProducts();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error in /api/store/products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour
