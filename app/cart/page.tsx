"use client";

import StarBorder from "@/components/UI/StarBorder";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IMSProduct } from "@/Types/Product";

const CartPage = () => {
  const {
    cartItems,
    authLoading,
    products,
    user,
    removeFromCart,
    incrementQty,
    decrementQty,
    setProducts,
  } = useAppContext();

  const router = useRouter();
  const [hydratedProducts, setHydratedProducts] = useState<IMSProduct[]>([]);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    }
  }, [authLoading, user, router]);

  /* ---------------- CART HYDRATION ---------------- */
  useEffect(() => {
    if (!cartItems.size) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydratedProducts([]);
      return;
    }

    const missingIds = Array.from(cartItems.keys()).filter(
      (productId) => !products.find((p) => p.productId === productId)
    );

    // If nothing missing, use context products
    if (!missingIds.length) {
      setHydratedProducts(products);
      return;
    }

    const hydrate = async () => {
      try {
        const fetchedProducts: IMSProduct[] = await Promise.all(
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

        // Merge into global context
        setProducts((prev) => {
          const merged = [...prev];
          fetchedProducts.forEach((fp) => {
            if (!merged.some((p) => p.productId === fp.productId)) {
              merged.push(fp);
            }
          });
          return merged;
        });

        setHydratedProducts([...products, ...fetchedProducts]);
      } catch (err) {
        console.error("Cart hydration failed:", err);
      }
    };

    hydrate();
  }, [cartItems, products, setProducts]);

  if (authLoading || !user) return null;

  const cartProducts = hydratedProducts.filter((p) =>
    cartItems.has(p.productId)
  );

  const cartTotal = cartProducts.reduce((sum, item) => {
    const qty = cartItems.get(item.productId)!;
    return sum + item.price * qty;
  }, 0);

  /* ---------------- EMPTY CART ---------------- */
  if (cartProducts.length === 0) {
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

  /* ---------------- RENDER ---------------- */
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
            <div className="flex justify-between w-full">
              {/* IMAGE */}
              <Image
                src={item.images?.[0] || "/Assets/Images/placeholder.png"}
                width={150}
                height={150}
                alt={item.name}
                className="object-contain"
              />

              {/* DETAILS */}
              <div className="flex flex-col justify-center text-left flex-1 px-6 gap-3">
                <div className="text-2xl font-bold line-clamp-1">
                  {item.name}
                </div>
                <p className="line-clamp-2">{item.description}</p>
                <div className="font-bold text-lg">
                  ₹{item.price * qty}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 w-50">
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrementQty(item.productId)}
                    className="w-10 bg-gray-200 hover:bg-gray-300"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    {qty}
                  </div>
                  <button
                    onClick={() => incrementQty(item.productId)}
                    className="w-10 bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  className="bg-red-600 text-white rounded-lg py-2"
                  onClick={() => removeFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </StarBorder>
        );
      })}

      {/* SUMMARY */}
      <div className="flex justify-between items-center border-t pt-6">
        <div className="text-2xl font-bold">Total: ₹{cartTotal}</div>

        <Link href="/checkout">
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
