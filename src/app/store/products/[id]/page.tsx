"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { useCartStore } from "@/store/cartStore";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

interface ProductVariant {
  id: number;
  name: string;
  variant_id: number;
  retail_price: string;
  currency: string;
  product: {
    image: string;
    name: string;
  };
  files: Array<{
    preview_url: string;
  }>;
}

interface ProductData {
  sync_product: {
    id: number;
    name: string;
    thumbnail_url: string;
  };
  sync_variants: ProductVariant[];
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);
      const response = await fetch(`/api/store/products/${id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.product);
        // Pre-select first variant
        if (
          data.product.sync_variants &&
          data.product.sync_variants.length > 0
        ) {
          setSelectedVariant(data.product.sync_variants[0]);
        }
      } else {
        setError(data.error || "Failed to load product");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  // Extract size and color from variant name (removes product name)
  function getVariantSizeColor(variantName: string): string {
    const parts = variantName.split(" - ");
    // Take only the last 2 parts (size and color), excluding the product name
    return parts.slice(-2).join(" / ");
  }

  function handleAddToCart() {
    if (!selectedVariant || !product) return;

    setAdding(true);

    // Extract size and color from variant name
    const variantParts = selectedVariant.name.split(" - ");
    const size = variantParts[variantParts.length - 2] || "One Size";
    const color = variantParts[variantParts.length - 1] || "Default";

    addItem({
      variantId: selectedVariant.variant_id,
      syncVariantId: selectedVariant.id,
      productId: product.sync_product.id,
      name: product.sync_product.name,
      size,
      color,
      price: parseFloat(selectedVariant.retail_price),
      quantity: 1,
      image: product.sync_product.thumbnail_url,
    });

    setTimeout(() => setAdding(false), 1000);
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundImage />
        <PageHeader title="Merch Store" />
        <main className="relative max-w-6xl mx-auto px-6 pb-32 mt-10">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="text-white mt-4 text-body-lg">Loading product...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <BackgroundImage />
        <PageHeader title="Merch Store" />
        <main className="relative max-w-6xl mx-auto px-6 pb-32 mt-10">
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-white text-body-lg">{error}</p>
            <Link
              href="/store"
              className="inline-block mt-4 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all"
            >
              Back to Store
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
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
        {/* Back Button */}
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 text-body"
        >
          <FaArrowLeft />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            {product.sync_product.thumbnail_url ? (
              <img
                src={product.sync_product.thumbnail_url}
                alt={product.sync_product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <span className="text-8xl">👕</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-display text-heading-xl text-white mb-4">
                {product.sync_product.name}
              </h1>
              <p className="text-heading-lg text-white font-semibold">
                ${selectedVariant?.retail_price || "0.00"}
              </p>
            </div>

            {/* Variant Selector */}
            <div className="space-y-4">
              <label className="block text-white text-body font-semibold">
                Select Size & Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.sync_variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-3 rounded-xl font-semibold text-body transition-all ${
                      selectedVariant?.id === variant.id
                        ? "bg-white text-black"
                        : "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
                    }`}
                  >
                    {getVariantSizeColor(variant.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-body flex items-center justify-center gap-3"
            >
              <FaShoppingCart className="text-xl" />
              {adding ? "Added!" : "Add to Cart"}
            </button>

            {/* Product Info */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-3">
              <p className="text-white/90 text-body">
                Official Kissay merchandise. High-quality print-on-demand
                products created and fulfilled by Printful.
              </p>
              <p className="text-white/70 text-body-sm">
                • Ships worldwide
                <br />
                • Premium quality materials
                <br />
                • Eco-friendly production
                <br />• Satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
