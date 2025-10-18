/**
 * Printful API Client
 * Documentation: https://developers.printful.com/docs/
 */

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  console.warn('Warning: PRINTFUL_API_KEY is not set in environment variables');
}

/**
 * Make authenticated request to Printful API
 */
async function printfulFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${PRINTFUL_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Printful API Error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.result; // Printful wraps responses in a 'result' field
}

/**
 * Get all sync products from the store
 */
export async function getStoreProducts() {
  try {
    const products = await printfulFetch('/store/products');

    // Fetch detailed info for each product to get pricing
    const productsWithPricing = await Promise.all(
      products.map(async (product: PrintfulProduct) => {
        try {
          const details = await printfulFetch(`/store/products/${product.id}`);
          const variants = details.sync_variants || [];

          // Calculate price range
          const prices = variants
            .map((v: PrintfulVariant) => parseFloat(v.retail_price))
            .filter((p: number) => !isNaN(p));

          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
          const currency = variants[0]?.currency || 'USD';

          return {
            ...product,
            minPrice,
            maxPrice,
            currency,
          };
        } catch (error) {
          console.error(`Error fetching details for product ${product.id}:`, error);
          return {
            ...product,
            minPrice: 0,
            maxPrice: 0,
            currency: 'USD',
          };
        }
      })
    );

    return productsWithPricing;
  } catch (error) {
    console.error('Error fetching store products:', error);
    return [];
  }
}

/**
 * Get a single product with all variants
 */
export async function getProduct(productId: string | number) {
  try {
    const product = await printfulFetch(`/store/products/${productId}`);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Get a specific product variant
 */
export async function getProductVariant(variantId: string | number) {
  try {
    const variant = await printfulFetch(`/store/variants/${variantId}`);
    return variant;
  } catch (error) {
    console.error(`Error fetching variant ${variantId}:`, error);
    return null;
  }
}

/**
 * Calculate shipping rates for an order
 */
export async function calculateShipping(recipient: {
  address1: string;
  city: string;
  country_code: string;
  state_code?: string;
  zip: string;
}, items: Array<{
  variant_id: number;
  quantity: number;
}>) {
  try {
    const rates = await printfulFetch('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify({
        recipient,
        items,
      }),
    });
    return rates;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return [];
  }
}

/**
 * Create an order in Printful
 * This will be called after successful payment
 */
export async function createOrder(orderData: {
  external_id: string; // Your order ID (e.g., Stripe payment intent ID)
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code?: string;
    country_code: string;
    zip: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    variant_id: number;
    quantity: number;
    retail_price?: string;
  }>;
  retail_costs?: {
    currency: string;
    subtotal: string;
    discount?: string;
    shipping: string;
    tax?: string;
  };
}) {
  try {
    const order = await printfulFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return order;
  } catch (error) {
    console.error('Error creating Printful order:', error);
    throw error;
  }
}

/**
 * Confirm an order (moves it to fulfillment)
 * Only call this after payment is confirmed
 */
export async function confirmOrder(orderId: string | number) {
  try {
    const confirmed = await printfulFetch(`/orders/${orderId}/confirm`, {
      method: 'POST',
    });
    return confirmed;
  } catch (error) {
    console.error(`Error confirming order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Get order details
 */
export async function getOrder(orderId: string) {
  try {
    // Orders can be referenced by external_id with @ prefix
    const order = await printfulFetch(`/orders/@${orderId}`);
    return order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
}

/**
 * Get catalog products (all available products from Printful catalog)
 */
export async function getCatalogProducts(categoryId?: number) {
  try {
    const endpoint = categoryId
      ? `/catalog/products?category_id=${categoryId}`
      : '/catalog/products';
    const products = await printfulFetch(endpoint);
    return products;
  } catch (error) {
    console.error('Error fetching catalog products:', error);
    return [];
  }
}

/**
 * Get catalog product details with variants
 */
export async function getCatalogProduct(productId: number) {
  try {
    const product = await printfulFetch(`/catalog/products/${productId}`);
    return product;
  } catch (error) {
    console.error(`Error fetching catalog product ${productId}:`, error);
    return null;
  }
}

export type PrintfulProduct = {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
};

export type PrintfulVariant = {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  is_ignored: boolean;
  sku: string | null;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: Array<{
    id: number;
    type: string;
    hash: string;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
  }>;
};

export type PrintfulOrder = {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  created: number;
  updated: number;
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    email: string;
  };
  items: Array<{
    id: number;
    external_id: string;
    variant_id: number;
    quantity: number;
    price: string;
    retail_price: string;
    name: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
  }>;
  shipments: Array<{
    id: number;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    created: number;
    ship_date: string;
    shipped_at: number;
    reshipment: boolean;
    items: Array<{
      item_id: number;
      quantity: number;
    }>;
  }>;
};
