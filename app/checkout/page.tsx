"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { useState } from "react";

const CheckoutPage = () => {
  const { cartItems, products } = useAppContext();

  const cartProducts = products.filter((p) =>
    cartItems.has(p.id)
  );

  const total = cartProducts.reduce((sum, p) => {
    const qty = cartItems.get(p.id) || 1;
    return sum + p.price * qty;
  }, 0);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  if (cartProducts.length === 0) {
    return <div className="p-10 text-xl">Your cart is empty</div>;
  }

  return (
    <div className="p-10 grid grid-cols-3 gap-8">
      
      {/* LEFT: SHIPPING DETAILS */}
      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Shipping Details
          </h2>

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

      {/* RIGHT: ORDER SUMMARY */}
      <div className="bg-white p-4 rounded-lg shadow h-fit">
        <h2 className="text-xl font-semibold mb-3">
          Order Summary
        </h2>

        {cartProducts.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center mb-3"
          >
            <Image
              src={item.image}
              width={50}
              height={50}
              alt={item.title}
              className="object-contain"
            />
            <div className="flex-1 ml-2 text-sm line-clamp-1">
              {item.title}
            </div>
            <div className="text-sm">
              x{cartItems.get(item.id)}
            </div>
            <div className="font-semibold">
              ₹{Math.round(item.price * 100)}
            </div>
          </div>
        ))}

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{Math.round(total * 100)}</span>
        </div>

        <button
          className="mt-4 w-full bg-black text-white py-2 rounded-lg"
          onClick={() => alert("Order Placed (demo)")}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
