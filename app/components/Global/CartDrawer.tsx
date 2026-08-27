"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { createSlug } from "@/lib/slug";
import { collectionMap } from "@/lib/collectionMap";

const FREE_SHIPPING = 999;

export default function CartDrawer() {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    cartItems,
    products,
    incrementQty,
    decrementQty,
    removeFromCart,
    lastAddedProduct,
  } = useAppContext();

  // Lock background scroll when the drawer is active to ensure flawless mobile browsing
  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartDrawerOpen]);

  const cartProducts = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.productId === item.productId);

        if (!product) return null;

        const variant =
          product.variants.find(
            (v) => v.color.toLowerCase() === item.color.toLowerCase(),
          ) ?? product.variants[0];

        return {
          ...item,
          product,
          variant,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return cartProducts.reduce(
      (sum, item) => sum + item!.product.price * item!.qty,
      0,
    );
  }, [cartProducts]);

  const remaining = Math.max(FREE_SHIPPING - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  const getCollections = (subCategories?: string | string[]) => {
    const categories = Array.isArray(subCategories)
      ? subCategories
      : subCategories
        ? [subCategories]
        : [];

    return [
      ...new Set(categories.map((sub) => collectionMap[sub]).filter(Boolean)),
    ];
  };

  const suggestionGroups = useMemo(() => {
    if (!lastAddedProduct) return [];

    const currentCollections = getCollections(
      lastAddedProduct.product.subcategory || [],
    );

    return currentCollections.map((collection) => ({
      collection,
      products: products
        .filter((product) => {
          if (product.productId === lastAddedProduct.product.productId)
            return false;

          const productCollections = getCollections(product.subcategory || []);

          return productCollections.includes(collection);
        })
        .slice(0, 8),
    }));
  }, [products, lastAddedProduct]);

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* ================= 🏛️ BACKDROP OVERLAY ================= */}
          {/* Constrained to leave 15vw on the left side on mobile, clicking anywhere here closes the drawer! */}
          <motion.div
            className="fixed inset-0 bg-neutral-950/40 dark:bg-black/60 backdrop-blur-xs z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
          />

          {/* ================= 🏛️ ASIDE DRAWER CONTAINER ================= */}
          {/* Width restricted on mobile (w-[85vw]) and standard sm:w-[420px] on desktop */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: "easeOut",
            }}
            className="fixed right-0 top-0 z-50 h-screen w-[85vw] sm:w-105 bg-white dark:bg-neutral-950 border-l border-neutral-100 dark:border-neutral-900 shadow-2xl flex flex-col text-neutral-800 dark:text-neutral-200 select-none transition-colors duration-300"
          >
            {/* 1. DRAWER HEADER */}
            <div className="border-b border-neutral-100 dark:border-neutral-900 px-6 py-5 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag
                      size={14}
                      className="text-[#6A0F1F] dark:text-[#e4e198]"
                    />
                    <span className="text-[10px] uppercase font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-widest">
                      Added Successfully
                    </span>
                  </div>

                  <h2 className="mt-2 font-serif text-xl sm:text-2xl font-light uppercase tracking-wide">
                    Shopping Bag
                  </h2>

                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mt-1">
                    {cartItems.length} Item{cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="rounded-full p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer"
                  title="Close Cart"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 2. DRAWER SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto custom-scroll py-2">
              <div className="px-5 space-y-4">
                {/* Cart Products List */}
                {cartProducts.map((item) => (
                  <div
                    key={`${item!.productId}-${item!.size}-${item!.color}`}
                    className="rounded-xl border border-neutral-100 dark:border-neutral-900 bg-[#fcfbfa]/50 dark:bg-black/30 p-4 shadow-xs"
                  >
                    <div className="flex gap-4">
                      {/* Product Thumbnail image */}
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900">
                        <Image
                          fill
                          src={
                            item!.variant.designs?.[0]?.images?.[0] ??
                            item!.variant.images?.[0] ??
                            "/Assets/Images/Newplaceholder.png"
                          }
                          alt={item!.product.name}
                          className="object-cover object-top pointer-events-none"
                          sizes="80px"
                          draggable={false}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-1 flex-col min-w-0">
                        <h3 className="line-clamp-2 text-xs font-semibold text-neutral-800 dark:text-white uppercase tracking-wide leading-tight">
                          {item!.product.name}
                        </h3>

                        <div className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 space-y-1">
                          <p>
                            Color:{" "}
                            <span className="text-neutral-600 dark:text-neutral-400 ml-1">
                              {item!.color}
                            </span>
                          </p>
                          <p>
                            Size:{" "}
                            <span className="text-neutral-600 dark:text-neutral-400 ml-1">
                              {item!.size}
                            </span>
                          </p>
                        </div>

                        <p className="mt-2 font-serif text-sm font-semibold text-[#6A0F1F] dark:text-[#e4e198] tracking-wide">
                          ₹{item!.product.price}
                        </p>

                        {/* Quantity Counter Control & Delete Buttons */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <button
                              onClick={() =>
                                decrementQty(
                                  item!.productId,
                                  item!.size,
                                  item!.color,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 transition cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="flex w-8 justify-center text-xs font-semibold">
                              {item!.qty}
                            </span>

                            <button
                              onClick={() =>
                                incrementQty(
                                  item!.productId,
                                  item!.size,
                                  item!.color,
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 transition cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeFromCart(
                                item!.productId,
                                item!.size,
                                item!.color,
                              )
                            }
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 hover:underline transition cursor-pointer"
                          >
                            <Trash2 size={11} strokeWidth={2.5} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Shipping Free Unlock Indicator card */}
                <div className="rounded-xl border border-neutral-100 dark:border-neutral-900 p-5 bg-white dark:bg-neutral-950 shadow-xs space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {remaining === 0
                        ? "🎉 Free Shipping Unlocked"
                        : `Add ₹${remaining} For Free Delivery`}
                    </span>
                    <span className="text-neutral-400">
                      Target: ₹{FREE_SHIPPING}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                    <motion.div
                      animate={{
                        width: `${progress}%`,
                      }}
                      className="h-full bg-[#6A0F1F] dark:bg-[#e4e198] transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Recommendations Collections Showcase */}
                {suggestionGroups.map((group) => (
                  <div key={group.collection} className="space-y-3 pt-2">
                    <div className="border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                      <h3 className="font-serif text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        Pair it with: {group.collection}
                      </h3>
                    </div>

                    <div className="-mx-5 overflow-x-auto px-5 pb-2 scrollbar-hide">
                      <div className="flex gap-4">
                        {group.products.map((product) => {
                          const variant = product.variants[0];

                          return (
                            <Link
                              key={product.productId}
                              href={{
                                pathname: `/${product.category.toLowerCase()}/${createSlug(
                                  product.name,
                                  product.productId,
                                )}`,
                                query: {
                                  color: variant.color,
                                },
                              }}
                              onClick={() => setCartDrawerOpen(false)}
                              className="min-w-67.5 max-w-67.5 shrink-0 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition duration-300 shadow-xs"
                            >
                              <div className="flex h-28">
                                <div className="relative h-full w-20 shrink-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-900">
                                  <Image
                                    src={
                                      variant.designs?.[0]?.images?.[0] ??
                                      variant.images?.[0] ??
                                      "/Assets/Images/Newplaceholder.png"
                                    }
                                    alt={product.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover object-top pointer-events-none"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col justify-between p-3 min-w-0">
                                  <div className="space-y-1">
                                    <p className="line-clamp-2 text-[10px] font-bold uppercase tracking-wide text-neutral-800 dark:text-white leading-normal">
                                      {product.name}
                                    </p>
                                    <p className="text-[9px] font-medium text-neutral-400 tracking-wider">
                                      Color: {variant.color}
                                    </p>
                                  </div>

                                  <div className="flex items-baseline justify-between border-t border-neutral-50 dark:border-neutral-900/50 pt-1.5">
                                    <p className="font-serif text-xs font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-wide">
                                      ₹{product.price}
                                    </p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
                                      {product.variants.length} Colors
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. DRAWER FOOTER (Total and checkout buttons) */}
            <div className="border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 p-5 shrink-0 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between select-none">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Subtotal Amount
                  </p>
                  <p className="text-xl font-serif font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-wide mt-1">
                    ₹{subtotal}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    Bag Quantity
                  </p>
                  <p className="text-sm font-bold text-neutral-800 dark:text-white mt-1">
                    {cartItems.length} Item{cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setCartDrawerOpen(false)}
                  className="block"
                >
                  <button className="w-full bg-[#6A0F1F] dark:bg-[#e4e198] hover:bg-neutral-900 dark:hover:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-widest py-4 rounded-md shadow-xs transition duration-300 flex items-center justify-center gap-2 cursor-pointer">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </button>
                </Link>

                {/* View Cart secondary option */}
                <Link
                  href="/cart"
                  onClick={() => setCartDrawerOpen(false)}
                  className="block"
                >
                  <button className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold uppercase tracking-widest py-3.5 rounded-md hover:border-neutral-800 dark:hover:border-neutral-500 transition duration-300 cursor-pointer">
                    View Shopping Bag
                  </button>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
