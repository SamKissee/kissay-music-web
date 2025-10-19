import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyWebhookSignature } from "@/lib/stripe";
import { createOrder, confirmOrder } from "@/lib/printful";
import Stripe from "stripe";

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
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const sessionEvent = event.data.object as Stripe.Checkout.Session;

        console.log("Payment successful for session:", sessionEvent.id);

        // Initialize Stripe client
        const stripe = new (await import("stripe")).default(
          process.env.STRIPE_SECRET_KEY!,
          { apiVersion: "2025-09-30.clover" }
        );

        // Fetch the full session with expanded line_items
        const session = await stripe.checkout.sessions.retrieve(
          sessionEvent.id,
          {
            expand: ["line_items.data.price.product"],
          }
        );

        // Extract order information
        const orderId = session.metadata?.order_id;
        const customerDetails = session.customer_details;
        const customerEmail = customerDetails?.email;
        const customerName = customerDetails?.name;
        const shippingAddress = customerDetails?.address;

        if (!orderId || !customerEmail || !shippingAddress) {
          console.error("Missing required order information", {
            orderId,
            customerEmail,
            hasShippingAddress: !!shippingAddress,
          });
          break;
        }

        console.log(`Processing order ${orderId} for ${customerEmail}`);

        // Get line items from the expanded session
        const lineItems = session.line_items;

        if (!lineItems) {
          console.error("No line items found in session");
          break;
        }

        // Build Printful order items
        const printfulItems = lineItems.data
          .filter((item) => {
            // Filter out shipping line items
            const product = item.price?.product as Stripe.Product;
            return product.name !== "Shipping";
          })
          .map((item) => {
            const product = item.price?.product as Stripe.Product;
            const syncVariantId = product.metadata?.sync_variant_id;

            if (!syncVariantId) {
              throw new Error(
                `No sync_variant_id found for product ${product.id}`
              );
            }

            return {
              sync_variant_id: parseInt(syncVariantId),
              quantity: item.quantity || 1,
              retail_price: ((item.amount_total || 0) / 100).toFixed(2),
            };
          });

        // Create Printful order
        try {
          const printfulOrder = await createOrder({
            external_id: orderId,
            recipient: {
              name: customerName || "Customer",
              address1: shippingAddress.line1 || "",
              city: shippingAddress.city || "",
              state_code: shippingAddress.state || undefined,
              country_code: shippingAddress.country || "US",
              zip: shippingAddress.postal_code || "",
              email: customerEmail,
            },
            items: printfulItems,
            retail_costs: {
              currency: "USD",
              subtotal: ((session.amount_subtotal || 0) / 100).toFixed(2),
              shipping: (
                ((session.amount_total || 0) - (session.amount_subtotal || 0)) / 100
              ).toFixed(2),
            },
          });

          // Only confirm orders in production (test orders stay as drafts)
          const isProduction = process.env.NODE_ENV === "production";

          if (isProduction) {
            await confirmOrder(printfulOrder.id);
            console.log(
              `✓ Printful order ${printfulOrder.id} confirmed for fulfillment`
            );
          } else {
            console.log(
              `✓ Printful order ${printfulOrder.id} created as DRAFT`
            );
          }
        } catch (printfulError) {
          console.error("Error creating Printful order:", printfulError);

          // Check if it's the "no print files" error
          if (
            printfulError instanceof Error &&
            printfulError.message.includes("print files")
          ) {
            console.error("⚠️  PRINTFUL SETUP REQUIRED:");
            console.error(
              "   Your products need designs/artwork uploaded in Printful dashboard"
            );
            console.error(
              "   Go to: https://www.printful.com/dashboard/products"
            );
            console.error(
              "   Payment was successful - customer received confirmation"
            );
            console.error(`   Order ID: ${orderId}`);
            console.error(`   Customer: ${customerEmail}`);
          }

          // Don't throw - payment was successful, just log the Printful issue
          // In production, you'd want to set up alerts for this
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session expired:", session.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook handler failed",
      },
      { status: 400 }
    );
  }
}

export const dynamic = "force-dynamic";
