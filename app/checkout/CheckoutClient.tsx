"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { IMSProduct } from "@/Types/Product";
import { toast } from "sonner";

type Props = {
  buyNowId: string | null;
};

const CheckoutClient = ({ buyNowId }: Props) => {
  const {
    products,
    cartItems,
    clearCart,
    loadUser,
    user, // ✅ FROM CONTEXT
  } = useAppContext();

  const router = useRouter();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  /* ✅ PREFILL ADDRESS IF PRESENT */
  useEffect(() => {
    if (user?.deliveryAddress) {
      setAddress(user.deliveryAddress.address ?? "");
      setPhone(user.deliveryAddress.phone ?? "");
    }
  }, [user]);

  /* ---------------- PRODUCTS ---------------- */
  const checkoutProducts = useMemo<
    (IMSProduct & { qty: number })[]
  >(() => {
    if (buyNowId) {
      const product = products.find(
        (p) => p.productId === Number(buyNowId)
      );
      return product ? [{ ...product, qty: 1 }] as (IMSProduct & { qty: number })[] : [];
    }

    return products
      .filter((p) => cartItems.has(p.productId))
      .map((p) => ({
        ...p,
        qty: cartItems.get(p.productId)!,
      })) as (IMSProduct & { qty: number })[];
  }, [buyNowId, products, cartItems]);

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
      toast.error("Please enter address and phone number");
      return;
    }

    try {
      const res = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          phone,
          products: checkoutProducts.map((p) => ({
            productId: p.productId,
            name: p.name,
            price: p.price,
            qty: p.qty,
          })),
          buyNow: Boolean(buyNowId),
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!buyNowId) clearCart();

      await loadUser(); // 🔄 refresh user to get saved address
      router.push("/orders");
      toast.success("Order is Placed!☺🎊")
    } catch (err) {
      console.error(err);
      toast.error("Order failed");
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
          onClick={handlePlaceOrder}
          className="mt-4 w-full bg-black text-white py-2 rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutClient;
