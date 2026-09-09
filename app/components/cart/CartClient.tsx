"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { IMSProduct } from "@/Types/Product";
import WhatsAppPageMessage from "../Global/WhatsAppPageMessage";
import { whatsappMessages } from "@/lib/whatsapp";
import {
  Plus,
  Minus,
  // Trash2,
  // ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";

/**
 * 👑 LUXURY REDESIGN: Shopping Cart Page (Nangalia Ruchira Theme)
 *
 * Styled for premium single-theme look:
 * - Geometric shape: Swapped bulky rounded-[28px] cards and rounded-full pills for elegant, clean rounded-xl and rounded-md containers.
 * - Spacious layout: Styled headers using our classic uppercase tracked typography and elegant serif names.
 * - Backdrop: bg-[#fcfbfa] with white cards and thin borders (border-neutral-100).
 */
const CartClient = () => {
  const {
    cartItems,
    products,
    savedForLater,
    removeSavedForLater,
    saveForLater,
    moveToCart,
    removeFromCart,
    incrementQty,
    decrementQty,
    setProducts,
  } = useAppContext();

  /* ---------------- FETCH MISSING PRODUCTS ---------------- */
  useEffect(() => {
    if (!cartItems) return;

    const productIdsInCart = Array.from(cartItems.values()).map(
      (item) => item.productId,
    );

    const missingIds = productIdsInCart.filter(
      (id) => !products.some((p) => p.productId === id),
    );

    if (!missingIds.length) return;

    const hydrate = async () => {
      try {
        const fetched: IMSProduct[] = await Promise.all(
          missingIds.map(async (id) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products/${id}`,
            );

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            return data.product as IMSProduct;
          }),
        );

        setProducts((prev) => {
          const map = new Map(prev.map((p) => [p.productId, p]));
          fetched.forEach((p) => map.set(p.productId, p));
          return Array.from(map.values());
        });
      } catch (err) {
        console.error("Cart hydration failed:", err);
      }
    };

    hydrate();
  }, [cartItems, products, setProducts]);

  /* ---------------- DERIVED DATA ---------------- */

  const cartEntries = useMemo(
    () => Array.from(cartItems.values()),
    [cartItems],
  );

  const cartTotal = useMemo(
    () =>
      cartEntries.reduce((sum, item) => {
        const product = products.find((p) => p.productId === item.productId);
        return product ? sum + product.price * item.qty : sum;
      }, 0),
    [cartEntries, products],
  );

  const shippingCharge = useMemo(() => {
    if (cartEntries.length === 0) return 0;
    return cartTotal >= 999 ? 0 : 150;
  }, [cartTotal, cartEntries.length]);

  const finalTotal = cartTotal + shippingCharge;

  return (
    <>
      <WhatsAppPageMessage message={whatsappMessages.cart(cartTotal)} />

      <div className="min-h-screen bg-[#fcfbfa] px-4 sm:px-6 lg:px-8 py-12 md:py-16 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* HEADER BLOCK */}
          <div className="border-b border-neutral-100 pb-6 mb-12 space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Review Bag
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 tracking-wide uppercase">
              Shopping Cart
            </h1>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* LEFT – ITEMS (Spans 8 columns on large screens) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Empty State */}
              {cartEntries.length === 0 && savedForLater.length === 0 && (
                <div className="rounded-2xl border border-dashed border-neutral-200 p-16 text-center bg-white shadow-xs">
                  <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-800 uppercase tracking-wide">
                    Your cart is empty
                  </h2>
                  <p className="mt-2 text-xs text-neutral-500 font-sans font-light tracking-wide">
                    Looks like you haven&apos;t added anything yet. Discover
                    slow, intentional garments crafted for everyday elegance.
                  </p>

                  <div className="pt-6">
                    <Link
                      href="/collection"
                      className="bg-[#6A0F1F] text-white hover:bg-[#4d0b18] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-md transition inline-flex"
                    >
                      Explore Collection
                    </Link>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              {cartEntries.length > 0 && (
                <div className="space-y-4">
                  {cartEntries.map((entry) => {
                    const product = products.find(
                      (p) => p.productId === entry.productId,
                    );
                    if (!product) return null;

                    return (
                      <div
                        key={`${entry.productId}_${entry.size}`}
                        className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-6 shadow-xs transition duration-300"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-[#faf9f6] shrink-0 border border-neutral-50">
                          <Image
                            src={
                              product.variants.find(
                                (v) => v.color === entry.color,
                              )?.designs?.[0]?.images?.[0] ??
                              product.variants.find(
                                (v) => v.color === entry.color,
                              )?.images?.[0] ??
                              product.variants[0]?.designs?.[0]?.images?.[0] ??
                              product.variants[0]?.images?.[0] ??
                              "/Assets/Images/Newplaceholder.png"
                            }
                            fill
                            sizes="(max-width:640px) 80px, 96px"
                            alt={product.name}
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-col flex-1 justify-between min-w-0">
                          <div>
                            <h2 className="text-sm sm:text-base font-semibold text-neutral-800 uppercase tracking-wide line-clamp-1">
                              {product.name}
                            </h2>

                            <div className="text-[11px] text-neutral-400 tracking-wide font-medium mt-2 space-y-0.5">
                              {entry.color && (
                                <p>
                                  Color:{" "}
                                  <span className="text-neutral-600 font-bold capitalize">
                                    {entry.color}
                                  </span>
                                </p>
                              )}
                              <p>
                                Size:{" "}
                                <span className="text-neutral-600 font-bold">
                                  {entry.size}
                                </span>
                              </p>
                              <p>
                                Unit Price:{" "}
                                <span className="text-neutral-600 font-bold">
                                  ₹{product.price}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Controls & Actions */}
                          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-neutral-50/50 pt-3">
                            {/* Quantity + Price */}
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              {/* Quantity Control block */}
                              <div className="flex items-center border border-neutral-200 rounded-md overflow-hidden bg-white">
                                <button
                                  onClick={() =>
                                    decrementQty(
                                      entry.productId,
                                      entry.size,
                                      entry.color,
                                    )
                                  }
                                  className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>

                                <div className="px-3 text-xs font-bold text-neutral-800">
                                  {entry.qty}
                                </div>

                                <button
                                  onClick={() =>
                                    incrementQty(
                                      entry.productId,
                                      entry.size,
                                      entry.color,
                                    )
                                  }
                                  className="px-3 py-1 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-base font-bold text-[#6A0F1F]">
                                ₹{product.price * entry.qty}
                              </div>
                            </div>

                            {/* Actions links */}
                            <div className="flex flex-wrap gap-4 text-[10px] tracking-widest font-bold uppercase text-neutral-400">
                              <button
                                onClick={() =>
                                  saveForLater(
                                    entry.productId,
                                    entry.size,
                                    entry.color,
                                  )
                                }
                                className="hover:text-[#6a0f1f] transition cursor-pointer"
                              >
                                Save for later
                              </button>

                              <button
                                onClick={() =>
                                  removeFromCart(
                                    entry.productId,
                                    entry.size,
                                    entry.color,
                                  )
                                }
                                className="hover:text-[#6a0f1f] transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ================= Saved For Later (Fully redesigned) ================= */}
              {savedForLater.length > 0 && (
                <div className="mt-16 border-t border-neutral-100 pt-10">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-800 uppercase tracking-wide">
                        Saved for Later
                      </h2>
                      <p className="text-xs font-light text-neutral-500 font-sans tracking-wide">
                        We&apos;ll keep these items ready whenever you&apos;re
                        ready to purchase.
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-100 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                      {savedForLater.length} Item
                      {savedForLater.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {savedForLater.map((item) => {
                      const product = products.find(
                        (p) => p.productId === item.productId,
                      );
                      if (!product) return null;

                      const variant = product.variants.find(
                        (v) => v.color === item.color,
                      );
                      if (!variant) return null;

                      return (
                        <div
                          key={`${item.productId}-${item.color}-${item.size}`}
                          className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-6 shadow-xs transition duration-300"
                        >
                          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between w-full">
                            {/* Left details */}
                            <div className="flex gap-4 sm:gap-5">
                              <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-[#faf9f6] shrink-0 border border-neutral-50">
                                <Image
                                  src={
                                    variant.designs?.[0]?.images?.[0] ||
                                    variant.images?.[0] ||
                                    "/Assets/Images/Newplaceholder.png"
                                  }
                                  alt={product.name}
                                  fill
                                  sizes="(max-width:640px) 80px, 96px"
                                  className="object-cover"
                                />
                              </div>

                              <div className="min-w-0 space-y-1">
                                <h3 className="text-sm sm:text-base font-semibold text-neutral-800 uppercase tracking-wide line-clamp-1">
                                  {product.name}
                                </h3>

                                <div className="text-[11px] text-neutral-400 tracking-wide font-medium space-y-0.5 pt-1">
                                  <p>
                                    Color:{" "}
                                    <span className="text-neutral-600 font-bold capitalize">
                                      {item.color}
                                    </span>
                                  </p>
                                  <p>
                                    Size:{" "}
                                    <span className="text-neutral-600 font-bold">
                                      {item.size}
                                    </span>
                                  </p>
                                </div>

                                <p className="pt-2 text-base font-bold text-neutral-800">
                                  ₹{product.price}
                                </p>
                              </div>
                            </div>

                            {/* Right controls */}
                            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
                              <button
                                onClick={() =>
                                  moveToCart(
                                    item.productId,
                                    item.size,
                                    item.color,
                                  )
                                }
                                className="flex-1 sm:flex-none rounded-md bg-[#6A0F1F] hover:bg-neutral-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition cursor-pointer"
                              >
                                Move to Cart
                              </button>

                              <button
                                onClick={() =>
                                  removeSavedForLater(
                                    item.productId,
                                    item.size,
                                    item.color,
                                  )
                                }
                                className="flex-1 sm:flex-none rounded-md border border-neutral-200 hover:border-red-500 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 bg-white transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT – ORDER SUMMARY (Spans 4 columns on large screens) */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8 shadow-xs lg:sticky lg:top-28">
                <h3 className="font-serif text-lg sm:text-xl font-light text-neutral-800 uppercase tracking-wide border-b border-neutral-50 pb-4">
                  Order Summary
                </h3>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-800">
                      ₹{cartTotal}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    <span>Shipping</span>
                    {shippingCharge === 0 ? (
                      <span className="font-bold text-green-600 uppercase">
                        Free
                      </span>
                    ) : (
                      <span className="font-bold text-neutral-800">
                        ₹{shippingCharge}
                      </span>
                    )}
                  </div>

                  {shippingCharge > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-700">
                      Add products worth <strong>₹{999 - cartTotal}</strong>{" "}
                      more to your cart and get <strong>FREE shipping</strong>.
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    <span>Estimated Taxes</span>
                    <span className="font-medium text-neutral-500">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="border-t border-neutral-100 pt-5 flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-neutral-800">
                      Grand Total
                    </span>

                    <span className="text-2xl font-bold text-[#6A0F1F]">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <Link href="/checkout" className="block mt-8">
                  <button className="w-full rounded-md bg-[#6A0F1F] hover:bg-neutral-900 py-4 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all duration-300">
                    Proceed to Checkout
                  </button>
                </Link>

                {/* Secure checkout badges */}
                <div className="mt-6 rounded-xl border border-neutral-50 bg-[#faf9f6]/50 p-4 space-y-2.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-neutral-400" />
                    <p>Free shipping above ₹999</p>
                  </div>
                  <div className="flex items-center gap-2 border-t border-neutral-50 pt-2.5">
                    <RefreshCw size={14} className="text-neutral-400" />
                    <p>Hassle-Free 3-Day Returns</p>
                  </div>
                  <div className="flex items-center gap-2 border-t border-neutral-50 pt-2.5">
                    <ShieldCheck size={14} className="text-neutral-400" />
                    <p>100% Secure Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartClient;
