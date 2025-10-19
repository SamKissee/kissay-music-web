"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { useCartStore } from "@/store/cartStore";
import { FaCheck, FaShoppingBag } from "react-icons/fa";

function SuccessContent() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart after successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Order Confirmed!" />

      <main className="relative max-w-2xl mx-auto px-6 pb-32 mt-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <FaCheck className="text-4xl text-white" />
          </div>

          {/* Success Message */}
          <div>
            <h1 className="text-display text-heading-xl text-white mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-white/80 text-body-lg">
              Your order has been confirmed and is being processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white/10 rounded-xl p-6 space-y-3 text-left">
            <p className="text-white text-body">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-white/80 text-body space-y-2 list-disc list-inside">
              <li>You will receive an order confirmation email shortly</li>
              <li>Your order will be sent to our print partner for fulfillment</li>
              <li>You will receive tracking information when your order ships</li>
              <li>Delivery typically takes 5-7 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link
              href="/store"
              className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95 text-body flex items-center justify-center gap-3"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 text-body text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t border-white/20">
            <p className="text-white/60 text-body-sm">
              Questions about your order? Contact us at{" "}
              <a
                href="mailto:hello@kissay.com"
                className="text-white hover:underline"
              >
                hello@kissay.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundImage />
        <PageHeader title="Loading..." />
        <main className="relative max-w-2xl mx-auto px-6 pb-32 mt-10">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        </main>
        <BottomNav />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
