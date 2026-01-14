"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CheckoutPage = () => {
  const { user, clearCart, cartItems, authLoading, products, loadUser } = useAppContext();
  const router = useRouter();
  const [address, setAddress] = useState(
    () => user?.deliveryAddress?.address || ""
  );
  const [phone, setPhone] = useState(() => user?.deliveryAddress?.phone || "");
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    }
  }, [authLoading, user, router]);
  if (authLoading || !user) return null;
  const cartProducts = products.filter((p) => cartItems.has(p.id));
  const total = cartProducts.reduce((sum, p) => {
    const qty = cartItems.get(p.id) || 1;
    return sum + p.price * qty;
  }, 0);
  if (cartProducts.length === 0) {
    return <div className="p-10 text-xl">Your cart is empty</div>;
  }
  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      alert("Please enter address and phone number");
      return;
    }
    const productsPayload = cartProducts.map((p) => ({
      productId: p.id,
      title: p.title,
      price: p.price,
      qty: cartItems.get(p.id),
    }));
    try {
      const res = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          phone,
          products: productsPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }
      clearCart();
      alert("Order placed successfully!");
      await loadUser();
      router.push("/orders"); // next: order success page
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong");
    }
  };

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
        {cartProducts.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <Image src={item.image} width={40} height={40} alt="" />
            <span>x{cartItems.get(item.id)}</span>
            <span>₹{Math.round(item.price * 100)}</span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{Math.round(total * 100)}</span>
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
