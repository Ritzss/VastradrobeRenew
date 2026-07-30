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
import { ShieldCheck, Truck, RefreshCw, ShoppingBag } from "lucide-react";

/**
 * 👑 LUXURY REDESIGN: Checkout Page (Nangalia Ruchira Theme)
 * 
 * Styled for premium single-theme look:
 * - Geometric shape: Swapped bulky rounded-4xl cards for elegant, clean rounded-2xl containers.
 * - Spaced uppercase tracked typography: All section headers and totals follow the new design system.
 * - Backdrop: bg-[#fcfbfa] with white cards and border-neutral-100 dividers.
 * - Inputs: Sleek rectangular input boxes with minimal outlines.
 */
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
      <div className="min-h-screen flex items-center justify-center text-neutral-400 bg-[#fcfbfa] dark:bg-black font-sans text-xs tracking-widest font-semibold uppercase animate-pulse">
        Preparing your checkout...
      </div>
    );
  }

  if (!checkoutProducts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 bg-[#fcfbfa] dark:bg-black font-sans text-xs tracking-widest font-semibold uppercase">
        Your cart is empty.
      </div>
    );
  }

  const subtotal = checkoutProducts.reduce(
    (sum, p) => sum + p.price * p.qty,
    0,
  );

  const shipping = paymentMethod === "COD" ? 70 : subtotal >= 999 ? 0 : 150;

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
      theme: { color: "#6A0F1F" },
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

  return (
    <div className="min-h-screen bg-[#fcfbfa] dark:bg-black px-4 sm:px-6 lg:px-8 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: DELIVERY DETAILS (Spans 7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header */}
          <div className="border-b border-neutral-100 dark:border-neutral-900 pb-5 space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">Secure Billing</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">Checkout</h1>
          </div>

          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-lg font-light text-neutral-800 dark:text-white uppercase tracking-wide border-b border-neutral-50 dark:border-neutral-900 pb-3">Delivery Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your shipping name"
                  className="w-full mt-2 px-4 py-3 text-xs uppercase font-semibold tracking-wider text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:border-neutral-800"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your 10-digit mobile number"
                  className="w-full mt-2 px-4 py-3 text-xs uppercase font-semibold tracking-wider text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:border-neutral-800"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment, city, state, and pincode"
                  rows={4}
                  className="w-full mt-2 px-4 py-3 text-xs uppercase font-semibold tracking-wider text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:border-neutral-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (Spans 5 columns) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 lg:sticky lg:top-28">
            <h3 className="font-serif text-lg sm:text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide border-b border-neutral-50 dark:border-neutral-900 pb-4">Order Summary</h3>

            {/* Products List */}
            <div className="space-y-4 max-h-52 overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-900 scroll-mt-2 pt-1 pr-1">
              {checkoutProducts.map((item, index) => (
                <div
                  key={`${item.productId}_${item.color}_${item.size}`}
                  className={`flex gap-4 items-center ${index > 0 ? "pt-4" : ""}`}
                >
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-[#faf9f6] border border-neutral-50 shrink-0">
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

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-white uppercase tracking-wide truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-400 tracking-widest font-bold uppercase mt-1">
                      {item.color && `${item.color} / `}Size {item.size} × {item.qty}
                    </p>
                  </div>

                  <div className="text-xs font-bold text-[#6A0F1F] dark:text-white">
                    ₹{item.price * item.qty}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations totals */}
            <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-900 pt-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-800 dark:text-white">₹{subtotal}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-bold text-green-600 uppercase">Free</span>
                ) : (
                  <span className="font-bold text-neutral-800 dark:text-white">₹{shipping}</span>
                )}
              </div>

              {shipping > 0 && paymentMethod === "ONLINE" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-700">
                  Add products worth <strong>₹{999 - subtotal}</strong> more to get <strong>FREE Shipping.</strong>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-neutral-400">
                <span>GST (5%)</span>
                <span className="font-bold text-neutral-800 dark:text-white">₹{gst}</span>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-5">
                <span className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-[#6A0F1F] dark:text-[#e4e198]">₹{total}</span>
              </div>
            </div>

            {/* Payment Method Swatches (Minimal outline boxes) */}
            <div className="space-y-3 pt-2">
              <label className="text-[9px] font-bold text-neutral-400 tracking-widest uppercase">Payment Method</label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-md border transition cursor-pointer ${
                    paymentMethod === "ONLINE"
                      ? "bg-[#6A0F1F] border-[#6A0F1F] text-white shadow-xs"
                      : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-800"
                  }`}
                >
                  Pay Online
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-md border transition cursor-pointer ${
                    paymentMethod === "COD"
                      ? "bg-[#6A0F1F] border-[#6A0F1F] text-white shadow-xs"
                      : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-800"
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            {/* CTA Buy Trigger */}
            <button
              onClick={() => {
                if (paymentMethod === "COD") {
                  verifyAndPlaceOrder({ paymentMethod: "COD" });
                } else {
                  handlePlaceOrder();
                }
              }}
              className="w-full py-4 bg-[#6A0F1F] hover:bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-md transition cursor-pointer"
            >
              {paymentMethod === "COD" ? "Place Order" : "Complete Payment"}
            </button>

            {/* Trust badge */}
            <div className="rounded-xl border border-neutral-50 dark:border-neutral-900 bg-[#faf9f6]/50 dark:bg-neutral-900/50 p-4 space-y-2.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-neutral-400" />
                <p>Free shipping above ₹999</p>
              </div>
              <div className="flex items-center gap-2 border-t border-neutral-50 dark:border-neutral-900 pt-2.5">
                <RefreshCw size={14} className="text-neutral-400" />
                <p>Hassle-Free 7-Day Returns</p>
              </div>
              <div className="flex items-center gap-2 border-t border-neutral-50 dark:border-neutral-900 pt-2.5">
                <ShieldCheck size={14} className="text-neutral-400" />
                <p>100% Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutClient;
