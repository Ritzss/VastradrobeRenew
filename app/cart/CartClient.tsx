"use client";

import StarBorder from "@/components/UI/StarBorder";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { IMSProduct } from "@/Types/Product";

const CartClient = () => {
  const {
    cartItems,
    products,
    removeFromCart,
    incrementQty,
    decrementQty,
    setProducts,
  } = useAppContext();

  /* ---------------- FETCH MISSING PRODUCTS ---------------- */
  useEffect(() => {
    if (!cartItems.size) return;

    const missingIds = Array.from(cartItems.keys()).filter(
      (id) => !products.some((p) => p.productId === id)
    );

    if (!missingIds.length) return;

    const hydrate = async () => {
      try {
        const fetched: IMSProduct[] = await Promise.all(
          missingIds.map(async (id) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products/${id}`,
              { cache: "no-store" }
            );

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();
            return data.product as IMSProduct;
          })
        );

        setProducts((prev) => {
          const map = new Map(
            prev.map((p) => [p.productId, p])
          );
          fetched.forEach((p) =>
            map.set(p.productId, p)
          );
          return Array.from(map.values());
        });
      } catch (err) {
        console.error("Cart hydration failed:", err);
      }
    };

    hydrate();
  }, [cartItems, products, setProducts]);

  /* ---------------- DERIVED DATA ---------------- */
  const cartProducts = useMemo(
    () =>
      products.filter((p) =>
        cartItems.has(p.productId)
      ),
    [products, cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartProducts.reduce((sum, item) => {
        const qty = cartItems.get(item.productId)!;
        return sum + item.price * qty;
      }, 0),
    [cartProducts, cartItems]
  );

  /* ---------------- EMPTY ---------------- */
  if (!cartProducts.length) {
    return (
      <div className="p-10 text-xl flex flex-col justify-center items-center gap-4">
        <div>Your cart is empty</div>
        <Link
          href="/"
          className="p-2 rounded bg-[#cd0000] text-white hover:rounded-xl transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {cartProducts.map((item) => {
        const qty = cartItems.get(item.productId)!;

        return (
          <StarBorder
            key={item.productId}
            color="#ffffff"
            speed="5s"
            className="cardBlock flex justify-between rounded-2xl my-2"
          >
            <div className="flex justify-between w-full p-4 text-start">
             <div className="relative w-[10%] h-[20vh] rounded-2xl">
               <Image
                src={
                  item.images?.[0] ??
                  "/Assets/Images/Newplaceholder.png"
                }
                fill
                sizes="photo"
                alt={item.name}
                className="object-contain"
              />
             </div>

              <div className="flex flex-col justify-center flex-1 px-6 gap-3">
                <div className="text-2xl font-bold line-clamp-1">
                  {item.name}
                </div>
                <p className="line-clamp-2">
                  {item.description}
                </p>
                <div className="font-bold text-lg">
                  ₹{item.price * qty}
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-between w-50">
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      decrementQty(item.productId)
                    }
                    className="w-10 bg-gray-200"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    {qty}
                  </div>
                  <button
                    onClick={() =>
                      incrementQty(item.productId)
                    }
                    className="w-10 bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.productId)
                  }
                  className="bg-red-600 text-white rounded-lg py-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </StarBorder>
        );
      })}

      <div className="flex justify-between items-center border-t pt-6">
        <div className="text-2xl font-bold">
          Total: ₹{cartTotal}
        </div>

        <Link href="/checkout">
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartClient;
