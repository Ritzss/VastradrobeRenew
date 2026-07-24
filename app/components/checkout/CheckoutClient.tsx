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
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">(
    "ONLINE",
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const buyNowSize = searchParams.get("size");
  const buyNowColor = searchParams.get("color");
  const buyNowId = searchParams.get("buyNow");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  /* PREFILL */
  useEffect(() => {
    if (user) {
      setName(user.username ?? "");

      if (user.deliveryAddress) {
        setAddress(user.deliveryAddress.address ?? "");
        setPhone(user.deliveryAddress.phone ?? "");
      }
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

  const subtotal = checkoutProducts.reduce(
    (sum, p) => sum + p.price * p.qty,
    0,
  );

  const shipping = paymentMethod === "COD" ? 70 : subtotal >= 450 ? 0 : 150;

  // GST @ 5%
  const gst = Number((subtotal * 0.05).toFixed(2));

  const total = subtotal + shipping + gst;

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
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill all delivery details");
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
    if (!user) {
      const registerRes = await fetch("/api/auth/register-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          mobile: phone,
          address,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        toast.error(registerData.message);
        return;
      }

      await loadUser();
    }

    const res = await fetch("/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        address,
        phone,
        payment,
        paymentMethod,
        shippingCharge: shipping,

        products: checkoutProducts.map((p) => ({
          productId: p.productId,
          name: p.name,
          price: p.price,
          qty: p.qty,
          color: p.color,
          size: p.size,
          image:
            p.variants.find((v) => v.color === p.color)?.designs?.[0]?.images ??
            p.variants.find((v) => v.color === p.color)?.images ??
            p.variants[0]?.designs?.[0]?.images ??
            p.variants[0]?.images ??
            [],
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
    toast.success(
      paymentMethod === "COD"
        ? "Order placed successfully 🎉"
        : "Payment successful 🎉",
    );
  };

  /* UI */
  return (
    <div className="min-h-screen not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] px-6 md:px-16 py-16 pt-28">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        {/* LEFT: DETAILS */}
        <div className="space-y-10">
          <h1 className="text-3xl font-semibold text-[#5f5143]">Checkout</h1>

          <div className="dark:bg-black/85 border border-white not-dark:bg-white rounded-4xl p-8 shadow-[0_20px_60px_rgba(149,127,106,0.15)] space-y-6">
            <div>
              <label className="text-sm text-[#7a6a5c]">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-3 text-[#7a6a5c] rounded-full border border-[#e6d8c8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#7a6a5c]">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full mt-2 px-4 py-3 text-[#7a6a5c] rounded-full border border-[#e6d8c8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#7a6a5c]">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                placeholder="Enter your Address"
                className="w-full mt-2 px-4 py-3 text-[#7a6a5c] rounded-2xl border border-[#e6d8c8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="dark:bg-black/85 border border-white not-dark:bg-white rounded-4xl p-8 shadow-[0_20px_60px_rgba(149,127,106,0.15)] h-fit space-y-6">
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
                      ?.designs?.[0]?.images?.[0] ||
                    item.variants.find((v) => v.color === item.color)
                      ?.images?.[0] ||
                    item.variants[0]?.designs?.[0]?.images?.[0] ||
                    item.variants[0]?.images?.[0] ||
                    "/Assets/Images/Newplaceholder.png"
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

          <div className="space-y-4 border-t pt-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-[#7a6a5c]">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between text-[#7a6a5c]">
              <span>Shipping</span>

              {shipping === 0 ? (
                <span className="font-medium text-green-600">Free</span>
              ) : (
                <span className="font-medium">₹{shipping}</span>
              )}
            </div>

            {/* Free Shipping Message */}
            {shipping > 0 && paymentMethod === "ONLINE" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                Add products worth <strong>₹{450 - subtotal}</strong> more to
                get
                <strong> FREE Shipping.</strong>
              </div>
            )}

            <div className="flex items-center justify-between text-[#7a6a5c]">
              <span>GST (5%)</span>

              <span>₹{gst}</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-[#e6d8c8] pt-4">
              <span className="text-lg font-semibold text-[#5f5143]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#5f5143]">
                ₹{total}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[#7a6a5c]">
              Payment Method
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE")}
                className={`flex-1 rounded-xl border p-3 transition ${
                  paymentMethod === "ONLINE"
                    ? "bg-[#5f5143] text-white border-[#5f5143]"
                    : "border-gray-300 dark:text-white"
                }`}
              >
                Pay Online
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`flex-1 rounded-xl border p-3 transition ${
                  paymentMethod === "COD"
                    ? "bg-[#5f5143] text-white border-[#5f5143]"
                    : "border-gray-300 dark:text-white"
                }`}
              >
                Cash on Delivery
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (paymentMethod === "COD") {
                verifyAndPlaceOrder({
                  paymentMethod: "COD",
                });
              } else {
                handlePlaceOrder();
              }
            }}
            className="group relative w-full overflow-hidden rounded-full bg-[#5f5143] py-4 text-white"
          >
            <span className="absolute inset-0 -translate-x-full -skew-x-12 bg-[#6a0f1f] transition-transform duration-500 ease-out group-hover:translate-x-0" />

            <span className="relative z-10">
              {paymentMethod === "COD" ? "Place Order" : "Complete Payment"}
            </span>
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
