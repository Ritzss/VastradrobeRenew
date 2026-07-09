"use client";

// import StarBorder from "@/components/UI/StarBorder";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { IMSProduct } from "@/Types/Product";

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

  /* ---------------- EMPTY ---------------- */
  // if (!cartEntries.length) {
  //   return (
  //     <div className="min-h-screen not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] flex items-center justify-center px-6">
  //       <div className="text-center max-w-lg space-y-6">
  //         <div className="text-5xl">🛍️</div>

  //         <h1 className="text-3xl font-semibold text-[#b68351]">
  //           Your cart feels light.
  //         </h1>

  //         <p className="text-[#b68351] leading-relaxed">
  //           Looks like you haven’t added anything yet. Discover timeless pieces
  //           crafted for everyday elegance.
  //         </p>

  //         <Link href="/">
  //           <button className=" mt-4 px-8 py-4 rounded-full bg-[#b68351] text-white hover:bg-[#6a0f1f] transition">
  //             Explore Collection
  //           </button>
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] px-6 md:px-16 py-16 pt-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#5f5143] mb-12">
          Your Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-12">
          {/* LEFT – ITEMS */}
          <div className="md:col-span-2 space-y-8">
            {/* Empty State */}
            {cartEntries.length === 0 && savedForLater.length === 0 && (
              <div className="rounded-3xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700">
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-neutral-500">
                  Looks like you haven&apos;t added anything yet.
                </p>

                <Link
                  href="/collection"
                  className="mt-8 inline-flex rounded-full bg-[#6a0f1f] px-8 py-3 text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {cartEntries.length > 0 && (
              <>
                {cartEntries.map((entry) => {
                  const product = products.find(
                    (p) => p.productId === entry.productId,
                  );
                  if (!product) return null;

                  return (
                    <div
                      key={`${entry.productId}_${entry.size}`}
                      className="dark:bg-black/85 border border-white not-dark:bg-white rounded-[28px] shadow-[0_20px_60px_rgba(149,127,106,0.12)] p-6 flex gap-6"
                    >
                      {/* Image */}
                      <div className="relative w-28 h-36 rounded-2xl overflow-hidden not-dark:bg-[#f3e7d8] shrink-0">
                        <Image
                          src={
                            product.variants.find(
                              (v) => v.color === entry.color,
                            )?.images?.[0] ??
                            product.variants[0]?.images?.[0] ??
                            "/Assets/Images/Newplaceholder.png"
                          }
                          fill
                          sizes="120px"
                          alt={product.name}
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h2 className="text-lg font-medium text-[#5f5143]">
                            {product.name}
                          </h2>

                          <div className="text-sm text-[#7a6a5c] mt-1">
                            {entry.color && <p>Color: {entry.color}</p>}
                            Size: {entry.size}
                          </div>

                          <p className="text-sm text-[#7a6a5c]">
                            ₹{product.price} each
                          </p>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-[#e6d8c8] rounded-full overflow-hidden">
                            <button
                              onClick={() =>
                                decrementQty(
                                  entry.productId,
                                  entry.size,
                                  entry.color,
                                )
                              }
                              className="px-4 py-2 dark:text-[#5f5143] hover:bg-[#f3e7d8] transition"
                            >
                              −
                            </button>

                            <div className="px-4 text-[#5f5143]">
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
                              className="px-4 py-2 dark:text-[#5f5143] hover:bg-[#f3e7d8] transition"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-lg font-semibold text-[#5f5143]">
                            ₹{product.price * entry.qty}
                          </div>

                          <button
                            onClick={() =>
                              saveForLater(
                                entry.productId,
                                entry.size,
                                entry.color,
                              )
                            }
                            className="text-sm font-medium  text-[#957f6a] hover:text-[#6a0f1f] transition"
                          >
                            Save for later
                          </button>

                          {/* Remove */}
                          <button
                            onClick={() =>
                              removeFromCart(
                                entry.productId,
                                entry.size,
                                entry.color,
                              )
                            }
                            className="text-sm text-[#957f6a] hover:text-[#6a0f1f] transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ================= Saved For Later ================= */}

            {savedForLater.length > 0 && (
              <div className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Saved for Later</h2>

                    <p className="mt-1 text-sm text-neutral-500">
                      We&apos;ll keep these items ready whenever you&apos;re ready.
                    </p>
                  </div>

                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-900">
                    {savedForLater.length} Item
                    {savedForLater.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-6">
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
                        className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
                      >
                        <div className="flex items-center gap-5">
                          <Image
                            src={variant.images[0]}
                            alt={product.name}
                            width={96}
                            height={112}
                            className="rounded-xl object-cover"
                          />

                          <div className="dark:text-[#5f5143]">
                            <h3 className="text-lg font-semibold">
                              {product.name}
                            </h3>

                            <p className="mt-1 text-sm">
                              {item.color} • {item.size}
                            </p>

                            <p className="mt-2 text-xl font-bold">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 self-end">
                          <button
                            onClick={() =>
                              moveToCart(item.productId, item.size, item.color)
                            }
                            className="rounded-full bg-black px-5 py-2 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
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
                            className="rounded-full border border-red-500 px-5 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT – SUMMARY */}
          <div className="md:col-span-1">
            <div className="dark:bg-black/85 border border-white  bg-white  rounded-4xl  shadow-[0_30px_80px_rgba(149,127,106,0.15)]  p-8  sticky top-28  space-y-6">
              <h3 className="text-xl font-semibold text-[#5f5143]">
                Order Summary
              </h3>

              <div className="flex justify-between text-[#7a6a5c]">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="border-t border-[#e6d8c8] pt-4 flex justify-between text-lg font-semibold text-[#5f5143]">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              <Link href="/checkout">
                <button className=" w-full py-4 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
