/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { IMSProduct } from "@/Types/Product";
import { toast } from "sonner";
import { fbPixel } from "@/lib/facebookpixel";

const CheckoutClient = () => {
  const { products, cartItems, clearCart, loadUser, user } = useAppContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const buyNowSize = searchParams.get("size");
  const buyNowColor = searchParams.get("color");
  const buyNowId = searchParams.get("buyNow");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  /* PREFILL */
  useEffect(() => {
    if (user?.deliveryAddress) {
      setAddress(user.deliveryAddress.address ?? "");
      setPhone(user.deliveryAddress.phone ?? "");
    }
  }, [user]);

  /* PRODUCTS */
  const checkoutProducts = useMemo(() => {
    if (!products.length) return [];

    if (buyNowId && buyNowSize) {
      const product = products.find((p) => p.productId === Number(buyNowId));
      if (!product) return [];

      return [
        {
          ...product,
          size: buyNowSize,
          color: buyNowColor,
          qty: 1,
        },
      ];
    }

    return cartItems
      .map((item) => {
        const product = products.find((p) => p.productId === item.productId);
        if (!product) return null;

        return {
          ...product,
          size: item.size,
          color: item.color,
          qty: item.qty,
        };
      })
      .filter(Boolean) as (IMSProduct & {
      size: string;
      color?: string | null;
      qty: number;
    })[];
  }, [buyNowColor, buyNowId, buyNowSize, cartItems, products]);

  if (!products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#5f5143]">
        Preparing your checkout...
      </div>
    );
  }

  if (!checkoutProducts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#5f5143]">
        Your cart is empty.
      </div>
    );
  }

  const total = checkoutProducts.reduce((sum, p) => sum + p.price * p.qty, 0);

  /* Razorpay */
  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      toast.error("Please enter address and phone number");
      return;
    }

    if (process.env.NODE_ENV === "development") {
      const timestamp = Date.now();
      await verifyAndPlaceOrder({
        razorpay_order_id: `dev_order_${timestamp}`,
        razorpay_payment_id: `dev_payment_${timestamp}`,
        razorpay_signature: "development",
      });

      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Payment system failed to load");
      return;
    }

    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: "INR",
      name: "VastraDrobe",
      order_id: order.id,
      handler: async (response: any) => {
        await verifyAndPlaceOrder(response);
      },
      prefill: { contact: phone },
      theme: { color: "#5f5143" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const verifyAndPlaceOrder = async (payment: any) => {
    const res = await fetch("/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        phone,
        payment,
        products: checkoutProducts.map((p) => ({
          productId: p.productId,
          name: p.name,
          price: p.price,
          color: p.color,
          qty: p.qty,
          size: p.size,
          image:
            p.variants.find((v) => v.color === p.color)?.images?.[0] ||
            p.variants[0]?.images?.[0] ||
            null,
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error("Payment verification failed");
      return;
    }

    fbPixel.purchase({
      orderId: data.orderId,
      total: data.totalAmount,
      products: data.products.map((p: any) => String(p.productId)),
    });

    clearCart();
    await loadUser();
    fbPixel.addPaymentInfo({
      total: total,
    });
    router.push("/orders");
    toast.success("Payment successful 🎉");
  };

  /* UI */
  return (
    <div className="min-h-screen light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] px-6 md:px-16 py-16 pt-28">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* LEFT: DETAILS */}
        <div className="space-y-10">
          <h1 className="text-3xl font-semibold text-[#5f5143]">Checkout</h1>

          <div className="dark:bg-black/85 border border-white light:bg-white rounded-4xl p-8 shadow-[0_20px_60px_rgba(149,127,106,0.15)] space-y-6">
            <div>
              <label className="text-sm text-[#7a6a5c]">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-2 px-4 py-3 text-[#7a6a5c] rounded-full border border-[#e6d8c8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#7a6a5c]">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full mt-2 px-4 py-3 text-[#7a6a5c] rounded-2xl border border-[#e6d8c8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="dark:bg-black/85 border border-white light:bg-white rounded-4xl p-8 shadow-[0_20px_60px_rgba(149,127,106,0.15)] h-fit space-y-6">
          <h2 className="text-xl font-semibold text-[#5f5143]">
            Order Summary
          </h2>

          {checkoutProducts.map((item) => (
            <div
              key={`${item.productId}_${item.color}_${item.size}`}
              className="flex gap-4 items-center"
            >
              <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f3e7d8]">
                <Image
                  src={
                    item.variants.find((v) => v.color === item.color)
                      ?.images?.[0] ||
                    item.variants[0]?.images?.[0] ||
                    "/Assets/Images/placeholder.png"
                  }
                  fill
                  alt={item.name}
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-sm text-[#5f5143]">
                <div className="font-medium">{item.name}</div>
                <div className="text-[#7a6a5c]">
                  {item.color && `${item.color} • `}
                  Size {item.size} × {item.qty}
                </div>
              </div>

              <div className="font-medium text-[#5f5143]">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between text-lg font-semibold text-[#5f5143]">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className=" w-full py-4 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition"
          >
            Complete Payment
          </button>

          <div className="text-xs text-center text-[#957f6a] pt-2">
            🔒 Secure payment powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
