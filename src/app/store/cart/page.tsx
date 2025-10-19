"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { useCartStore } from "@/store/cartStore";
import { FaArrowLeft, FaTrash, FaMinus, FaPlus } from "react-icons/fa";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotalPrice();

  // Calculate shipping based on quantity (Printful rates)
  // $8.49 first item + $2.50 each additional
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = totalItems === 0
    ? 0
    : totalItems === 1
    ? 8.49
    : 8.49 + ((totalItems - 1) * 2.50);

  const total = subtotal + shippingCost;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.syncVariantId,
            syncVariantId: item.syncVariantId,
            quantity: item.quantity,
          })),
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout URL directly
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL provided");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Shopping Cart" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32 mt-10">
        {/* Back Button */}
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-body"
        >
          <FaArrowLeft />
          Continue Shopping
        </Link>

        {items.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-white text-body-lg mb-6">Your cart is empty</p>
            <Link
              href="/store"
              className="inline-block px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
            >
              Shop Merch
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-white/5 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-body mb-2">
                      {item.name}
                    </h3>
                    <p className="text-white/70 text-body-sm">
                      {item.size} • {item.color}
                    </p>
                    <p className="text-white font-semibold text-body mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-white/70 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>

                    <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sticky top-6">
                <h2 className="text-white text-heading-md font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white/80 text-body">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/80 text-body">
                    <span>Shipping ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between text-white text-body-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white/80 text-body-sm mb-2"
                    >
                      Email for order confirmation
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-body"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-white text-body-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-body"
                  >
                    {loading ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </form>

                <p className="text-white/60 text-body-sm mt-4 text-center">
                  Secure payment via Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
