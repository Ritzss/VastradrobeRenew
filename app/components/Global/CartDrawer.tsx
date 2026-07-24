"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
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

  useEffect(() => {
    document.body.style.paddingRight = cartDrawerOpen ? "420px" : "";

    return () => {
      document.body.style.paddingRight = "";
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

  // const getCollections = (subCategories?: string | string[]) => {
  //   const categories = Array.isArray(subCategories)
  //     ? subCategories
  //     : subCategories
  //       ? [subCategories]
  //       : [];

  //   return [
  //     ...new Set(categories.map((sub) => collectionMap[sub]).filter(Boolean)),
  //   ];
  // };

  const getCollections = (subCategories?: string | string[]) => {
    const categories = Array.isArray(subCategories)
      ? subCategories
      : subCategories
        ? [subCategories]
        : [];

    return [
      ...new Set(
        categories
          .map((sub) => collectionMap[sub])
          .filter(Boolean),
      ),
    ];
  };

  // const suggestions = useMemo(() => {
  //   if (!lastAddedProduct) return [];

  //   // Collections of the added product
  //   const currentCollections = getCollections(
  //     lastAddedProduct.product.subcategory,
  //   );

  //   return products
  //     .filter((product) => {
  //       if (product.productId === lastAddedProduct.product.productId) {
  //         return false;
  //       }

  //       const productCollections = getCollections(product.subcategory);

  //       return productCollections.some((collection) =>
  //         currentCollections.includes(collection),
  //       );
  //     })
  //     .slice(0, 8);
  // }, [products, lastAddedProduct]);

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
          {/* <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
          /> */}

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.3,
            }}
            className="fixed right-0 top-0 z-50 h-screen w-full sm:w-105 bg-white shadow-2xl flex flex-col"
          >
            {/* HEADER */}

            <div className="border-b px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-green-600" />

                    <span className="text-sm text-green-600 font-medium">
                      Added Successfully
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-semibold">Shopping Bag</h2>

                  <p className="text-sm text-neutral-500 mt-1">
                    {cartItems.length} Item
                    {cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="rounded-full p-2 hover:bg-neutral-100 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* CART */}

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-4">
                {cartProducts.map((item) => (
                  <div
                    key={`${item!.productId}-${item!.size}-${item!.color}`}
                    className="rounded-2xl border bg-neutral-50 p-4"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image
                          fill
                          src={
                            item!.variant.designs?.[0]?.images?.[0] ??
                            item!.variant.images?.[0] ??
                            "/Assets/Images/Newplaceholder.png"
                          }
                          alt={item!.product.name}
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h3 className="line-clamp-2 font-semibold">
                          {item!.product.name}
                        </h3>

                        <div className="mt-2 text-sm text-neutral-500 space-y-1">
                          <p>
                            Color :
                            <span className="ml-1 font-medium">
                              {item!.color}
                            </span>
                          </p>

                          <p>
                            Size :
                            <span className="ml-1 font-medium">
                              {item!.size}
                            </span>
                          </p>
                        </div>

                        <p className="mt-2 text-xl font-bold">
                          ₹{item!.product.price}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="flex items-center overflow-hidden rounded-lg border">
                            <button
                              onClick={() =>
                                decrementQty(
                                  item!.productId,
                                  item!.size,
                                  item!.color,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center hover:bg-neutral-200"
                            >
                              <Minus size={16} />
                            </button>

                            <span className="flex w-10 justify-center font-medium">
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
                              className="flex h-9 w-9 items-center justify-center hover:bg-neutral-200"
                            >
                              <Plus size={16} />
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
                            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* SHIPPING */}

                <div className="rounded-2xl border p-5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {remaining === 0
                        ? "🎉 Free Shipping Unlocked"
                        : `Add ₹${remaining} more`}
                    </span>

                    <span>₹{subtotal}</span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200">
                    <motion.div
                      animate={{
                        width: `${progress}%`,
                      }}
                      className="h-full bg-green-600"
                    />
                  </div>
                </div>

                {/* RECOMMENDATIONS */}

                {/* {suggestions.length > 0 && (
                  <div>
                    <div className="mb-4 px-1">
                      <h3 className="text-lg font-semibold">
                        You May Also Like
                      </h3>
                    </div>

                    <div className="-mx-5 overflow-x-auto px-5 pb-2">
                      <div className="flex gap-4 snap-x snap-mandatory">
                        {suggestions.map((product) => {
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
                                  color: product.variants[0].color,
                                },
                              }}
                              onClick={() => setCartDrawerOpen(false)}
                              className="min-w-67.5 max-w-67.5 shrink-0 snap-start rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition"
                            >
                              <div className="flex">
                                <div className="relative h-32 w-28 shrink-0 overflow-hidden">
                                  <Image
                                    src={
                                      variant.designs?.[0]?.images?.[0] ??
                                      variant.images?.[0] ??
                                      "/Assets/Images/Newplaceholder.png"
                                    }
                                    alt={product.name}
                                    fill
                                    sizes="112px"
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col justify-between p-2">
                                  <div>
                                    <p className="line-clamp-2 text-sm font-medium">
                                      {product.name}
                                    </p>

                                    <p className="mt-2 text-xs text-neutral-500">
                                      {variant.color}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-lg font-bold">
                                      ₹{product.price}
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500">
                                      {product.variants.length} Color
                                      {product.variants.length > 1 ? "s" : ""}
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
                )} */}

                {/* RECOMMENDATIONS */}

                {suggestionGroups.map((group) => (
                  <div key={group.collection}>
                    <div className="mb-4 px-1">
                      <h3 className="text-lg font-semibold">
                        {group.collection}
                      </h3>
                    </div>

                    <div className="-mx-5 overflow-x-auto px-5 pb-2">
                      <div className="flex gap-4 snap-x snap-mandatory">
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
                              className="min-w-67.5 max-w-67.5 shrink-0 snap-start rounded-2xl border bg-white overflow-hidden hover:shadow-lg transition"
                            >
                              <div className="flex">
                                <div className="relative h-32 w-28 shrink-0 overflow-hidden">
                                  <Image
                                    src={
                                      variant.designs?.[0]?.images?.[0] ??
                                      variant.images?.[0] ??
                                      "/Assets/Images/Newplaceholder.png"
                                    }
                                    alt={product.name}
                                    fill
                                    sizes="112px"
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col justify-between p-2">
                                  <div>
                                    <p className="line-clamp-2 text-sm font-medium">
                                      {product.name}
                                    </p>

                                    <p className="mt-2 text-xs text-neutral-500">
                                      {variant.color}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-lg font-bold">
                                      ₹{product.price}
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500">
                                      {product.variants.length} Color
                                      {product.variants.length > 1 ? "s" : ""}
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

            {/* FOOTER */}

            <div className="sticky bottom-0 border-t bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Subtotal</p>

                  <p className="text-2xl font-bold">₹{subtotal}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-neutral-500">
                    {cartItems.length} Item
                    {cartItems.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout" onClick={() => setCartDrawerOpen(false)}>
                  <button className="w-full rounded-xl bg-[#6A0F1F] py-3.5 font-semibold text-white transition hover:opacity-90">
                    Checkout
                  </button>
                </Link>

                <Link href="/cart" onClick={() => setCartDrawerOpen(false)}>
                  <button className="w-full rounded-xl border border-neutral-300 py-3.5 font-medium transition hover:bg-neutral-100">
                    View Cart
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
