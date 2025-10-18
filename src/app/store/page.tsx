"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { useCartStore } from "@/store/cartStore";
import { FaShoppingCart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch("/api/store/products");
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Merch Store" />

      {/* Cart Button - Fixed Position */}
      <Link
        href="/store/cart"
        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
      >
        <FaShoppingCart className="text-xl" />
        <span>Cart</span>
        {totalItems > 0 && (
          <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {totalItems}
          </span>
        )}
      </Link>

      <main className="relative max-w-6xl mx-auto px-6 pb-32 mt-10">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4 text-body-lg">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-white text-body-lg">{error}</p>
            <p className="text-white/80 text-body-sm mt-2">
              Please make sure your Printful API key is configured correctly.
            </p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center">
            <p className="text-white text-body-lg">
              No products available yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/store/products/${product.id}`}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <span className="text-6xl">👕</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-white text-heading-sm font-semibold mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-body-lg">
                        {product.minPrice === product.maxPrice
                          ? `$${product.minPrice.toFixed(2)}`
                          : `$${product.minPrice.toFixed(2)} - $${product.maxPrice.toFixed(2)}`}
                      </p>
                      <p className="text-white/70 text-body-sm">
                        {product.variants} variant
                        {product.variants !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
