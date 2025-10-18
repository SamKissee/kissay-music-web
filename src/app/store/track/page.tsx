"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { FaSearch, FaBox, FaShippingFast, FaArrowLeft } from "react-icons/fa";

interface OrderDetails {
  id: number;
  external_id: string;
  status: string;
  created: number;
  updated: number;
  recipient: {
    name: string;
    city: string;
    state: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    image: string;
  }>;
  shipments: Array<{
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    ship_date: string;
    status: string;
  }>;
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();

    if (!orderId || orderId.length < 5) {
      setError("Please enter a valid order ID");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/store/orders/${orderId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Order not found");
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Error tracking order:", err);
      setError(err instanceof Error ? err.message : "Failed to track order");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "fulfilled":
      case "shipped":
        return "text-green-400";
      case "pending":
      case "processing":
        return "text-yellow-400";
      case "canceled":
        return "text-red-400";
      default:
        return "text-white";
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Track Order" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32 mt-10">
        {/* Back Button */}
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-body"
        >
          <FaArrowLeft />
          Back to Store
        </Link>

        {/* Order ID Input */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label
                htmlFor="orderId"
                className="block text-white text-body-lg font-semibold mb-3"
              >
                Enter your Order ID
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="KISSAY-1234567890"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-body"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-body flex items-center gap-2"
                >
                  <FaSearch />
                  {loading ? "Searching..." : "Track"}
                </button>
              </div>
            </div>

            <p className="text-white/60 text-body-sm">
              Your order ID can be found in your confirmation email
            </p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-white text-body">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white text-heading-lg font-semibold mb-2">
                    Order #{order.external_id}
                  </h2>
                  <p className={`text-body-lg font-semibold ${getStatusColor(order.status)}`}>
                    Status: {order.status}
                  </p>
                </div>
                <FaBox className="text-white/50 text-5xl" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-white/80 text-body">
                <div>
                  <p className="text-white/60 text-body-sm mb-1">Ordered</p>
                  <p>{new Date(order.created * 1000).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-body-sm mb-1">Shipping To</p>
                  <p>
                    {order.recipient.city}, {order.recipient.state}, {order.recipient.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.shipments && order.shipments.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaShippingFast className="text-white text-3xl" />
                  <h3 className="text-white text-heading-md font-semibold">
                    Shipping Information
                  </h3>
                </div>

                <div className="space-y-4">
                  {order.shipments.map((shipment, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl p-6 space-y-3"
                    >
                      <div className="grid md:grid-cols-2 gap-4 text-white text-body">
                        <div>
                          <p className="text-white/60 text-body-sm mb-1">Carrier</p>
                          <p className="font-semibold">{shipment.carrier}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-body-sm mb-1">Service</p>
                          <p>{shipment.service}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-body-sm mb-1">
                            Tracking Number
                          </p>
                          <p className="font-mono text-body-sm">
                            {shipment.tracking_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-body-sm mb-1">Status</p>
                          <p className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </p>
                        </div>
                      </div>

                      {shipment.tracking_url && (
                        <a
                          href={shipment.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 text-body"
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h3 className="text-white text-heading-md font-semibold mb-6">
                Order Items
              </h3>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center bg-white/10 rounded-xl p-4"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-body">
                        {item.name}
                      </p>
                      <p className="text-white/70 text-body-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-semibold text-body">
                      ${item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
