"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IMSProduct } from "@/Types/Product";

const CheckoutPage = () => {
  const {
    user,
    clearCart,
    cartItems,
    authLoading,
    products,
    loadUser,
  } = useAppContext();

  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams.get("buyNow");

  const [address, setAddress] = useState(
    () => user?.deliveryAddress?.address || ""
  );
  const [phone, setPhone] = useState(
    () => user?.deliveryAddress?.phone || ""
  );

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) return null;

  /* ---------------- CHECKOUT MODE LOGIC ---------------- */
  let checkoutProducts: (IMSProduct & { qty: number })[] = [];

  if (buyNowId) {
    // 🔥 BUY NOW MODE
    const product = products.find(
      (p) => p.productId === Number(buyNowId)
    );

    if (product) {
      checkoutProducts = [{ ...product, qty: 1 }];
    }
  } else {
    // 🛒 CART MODE
    checkoutProducts = products
      .filter((p) => cartItems.has(p.productId))
      .map((p) => ({
        ...p,
        qty: cartItems.get(p.productId)!,
      }));
  }

  if (!checkoutProducts.length) {
    return <div className="p-10 text-xl">Your cart is empty</div>;
  }

  const total = checkoutProducts.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  /* ---------------- PLACE ORDER ---------------- */
  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      alert("Please enter address and phone number");
      return;
    }

    const productsPayload = checkoutProducts.map((p) => ({
      productId: p.productId,
      name: p.name,
      price: p.price,
      qty: p.qty,
    }));

    try {
      const res = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          phone,
          products: productsPayload,
          buyNow: !!buyNowId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      if (!buyNowId) {
        clearCart();
      }

      alert("Order placed successfully!");
      await loadUser();
      router.push("/orders");
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10 grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />
          <textarea
            placeholder="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-fit">
        {checkoutProducts.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center mb-2"
          >
            <Image
              src={item.images?.[0] || "/Assets/Images/placeholder.png"}
              width={40}
              height={40}
              alt={item.name}
            />
            <span>x{item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          className="mt-4 w-full bg-black text-white py-2 rounded-lg"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
