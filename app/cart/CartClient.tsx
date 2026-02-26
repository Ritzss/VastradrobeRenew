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
    if (!cartItems) return;

    const productIdsInCart = Array.from(cartItems.values()).map(
      (item) => item.productId
    );

    const missingIds = productIdsInCart.filter(
      (id) => !products.some((p) => p.productId === id)
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
          })
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
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartEntries.reduce((sum, item) => {
        const product = products.find(
          (p) => p.productId === item.productId
        );
        return product ? sum + product.price * item.qty : sum;
      }, 0),
    [cartEntries, products]
  );

  /* ---------------- EMPTY ---------------- */
  if (!cartEntries.length) {
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

      {cartEntries.map((entry) => {
        const product = products.find(
          (p) => p.productId === entry.productId
        );
        if (!product) return null;

        return (
          <StarBorder
            key={`${entry.productId}_${entry.size}`}
            color="#ffffff"
            speed="5s"
            className="cardBlock flex justify-between rounded-2xl my-2"
          >
            <div className="flex justify-between w-full p-4 text-start">
             <div className="w-[10%] h-[30vh]">
               <div className="relative border w-full h-[25vh] overflow-hidden rounded-2xl">
                <Image
                  src={
                    product.images?.[0] ??
                    "/Assets/Images/Newplaceholder.png"
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 10vw"
                  alt={product.name}
                  className=""
                />
               
              </div>
               {/* Quantity box */}
                <div className="flex border mt-1 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      decrementQty(entry.productId, entry.size)
                    }
                    className="w-10 bg-gray-200"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    {entry.qty}
                  </div>
                  <button
                    onClick={() =>
                      incrementQty(entry.productId, entry.size)
                    }
                    className="w-10 bg-gray-200"
                  >
                    +
                  </button>
                </div>
             </div>

              <div className="flex flex-col justify-center flex-1 px-6 gap-3">
                <div className="text-2xl font-bold line-clamp-1">
                  {product.name}
                </div>
                <p className="line-clamp-2">{product.description}</p>
                <p className="font-semibold">
                  Size: {entry.size}
                </p>
                
              </div>

              <div className="flex relative flex-col gap-3 w-50">
                {/* Quantity box */}
                {/* <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      decrementQty(entry.productId, entry.size)
                    }
                    className="w-10 bg-gray-200"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    {entry.qty}
                  </div>
                  <button
                    onClick={() =>
                      incrementQty(entry.productId, entry.size)
                    }
                    className="w-10 bg-gray-200"
                  >
                    +
                  </button>
                </div> */}
                {/* price */}
                <div className="text-xl p-1 ">
                  Price: <span className="font-bold text-2xl">₹{product.price * entry.qty}</span>
                </div>

                {/* remove box */}
                <button
                  onClick={() =>
                    removeFromCart(entry.productId, entry.size)
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

      <div className="flex justify-between items-center border-t-4 pt-6">
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
