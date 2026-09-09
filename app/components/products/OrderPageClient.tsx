"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IMSProduct } from "@/Types/Product";
import { Order } from "@/Types/Order";
import Image from "next/image";
import EmptyState from "@/components/Global/EmptyState";
import Link from "next/link";
import { createSlug } from "@/lib/slug";
import {
  // FileText,
  Calendar,
  // Truck,
  CreditCard,
  ChevronDown,
  Package,
  MapPin,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_STEPS_ONLINE = [
  "pending",
  "paid",
  "packing",
  "shipping",
  "delivered",
];
const STATUS_STEPS_COD = ["pending", "packing", "shipping", "delivered"];

const statusLabel: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  packing: "Packing",
  shipping: "Shipped",
  delivered: "Delivered",
};

// Colors mapping for status tags
const statusBadgeColors: Record<string, string> = {
  pending:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30",
  paid: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30",
  packing:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/30",
  shipping:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/30",
  delivered:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30",
};

const OrdersPageClient = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [detailedProduct, setDetailedProduct] = useState<
    Record<number, IMSProduct>
  >({});
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my");

        if (res.status === 401) {
          router.push("/account/login");
          return;
        }

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("FAILED TO FETCH ORDERS:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const loadDetailedProducts = async (order: Order) => {
    for (const item of order.items) {
      if (detailedProduct[item.productId]) continue;

      try {
        const imsUrl =
          process.env.NEXT_PUBLIC_IMS_BASE_URL || "https://ims.vastradrobe.com";
        const res = await fetch(
          `${imsUrl}/api/ims/public/products/${item.productId}`,
          { next: { revalidate: 120 } },
        );
        if (!res.ok) continue;

        const data = await res.json();

        setDetailedProduct((prev) => ({
          ...prev,
          [item.productId]: data.product,
        }));
      } catch (err) {
        console.error("FAILED TO FETCH DETAILED PRODUCT:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfbfa] dark:bg-black flex items-center justify-center">
        <div className="space-y-4 text-center select-none">
          <div className="w-10 h-10 border-2 border-[#6A0F1F] dark:border-[#e4e198] border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Loading Orders...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcfbfa] dark:bg-black flex items-center justify-center px-6">
        <EmptyState
          label="No Orders Yet"
          title="Your Wardrobe Awaits"
          description="You haven’t placed any orders yet. Discover timeless silhouettes and elevated everyday essentials."
          buttonText="Explore Collections →"
          buttonLink="/"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 px-4 sm:px-6 lg:px-8 py-24 md:py-32 transition-colors duration-300 select-none">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ================= 🏛️ HEADER BLOCK ================= */}
        <div className="text-left space-y-2 border-b border-neutral-100 dark:border-neutral-900 pb-6">
          <p className="text-[10px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.25em] uppercase">
            Customer Profile
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white uppercase tracking-wide">
            My Orders
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light font-sans tracking-wide">
            Track shipping timelines, view detailed items, and manage invoices.
          </p>
        </div>

        {/* ================= 🏛️ ORDERS TIMELINE CARDS ================= */}
        <div className="space-y-8">
          {orders.map((order) => {
            const isCOD = order.paymentMethod === "COD";
            // 🔒 COD vs Online Dynamic Timeline Steps
            const steps = isCOD ? STATUS_STEPS_COD : STATUS_STEPS_ONLINE;
            const currentStepIndex = steps.indexOf(order.status);
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6 transition duration-300"
              >
                {/* 1. ORDER SUMMARY BAR */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-neutral-400" />
                      <p className="text-xs font-bold tracking-widest uppercase text-neutral-800 dark:text-white">
                        Order #{order.orderNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
                      <Calendar size={11} />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${statusBadgeColors[order.status] || "bg-neutral-100 text-neutral-600"}`}
                  >
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>

                {/* 2. PREMIUM HORIZONTAL TRACKER */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between w-full">
                    {/* Background Bar */}
                    <div className="absolute left-0 right-0 h-0.5 bg-neutral-100 dark:bg-neutral-900 z-0" />

                    {/* Progress Bar (Dynamic width based on current index) */}
                    <div
                      className="absolute left-0 h-0.5 bg-[#6A0F1F] dark:bg-[#e4e198] z-0 transition-all duration-500 ease-out"
                      style={{
                        width:
                          currentStepIndex >= 0
                            ? `${(currentStepIndex / (steps.length - 1)) * 100}%`
                            : "0%",
                      }}
                    />

                    {/* Steps dots */}
                    {steps.map((step, idx) => {
                      const isActive = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step}
                          className="relative z-10 flex flex-col items-center"
                        >
                          {/* Dot indicator */}
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isActive
                                ? "bg-[#6A0F1F] dark:bg-[#e4e198] scale-110 shadow-xs"
                                : "bg-neutral-200 dark:bg-neutral-800"
                            } ${isCurrent ? "ring-4 ring-[#6A0F1F]/20 dark:ring-[#e4e198]/20" : ""}`}
                          >
                            {isCurrent && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black animate-pulse" />
                            )}
                          </div>

                          {/* Label (Micro uppercase typography, centered) */}
                          <span
                            className={`absolute top-5 text-[7.5px] font-bold uppercase tracking-wider whitespace-nowrap hidden sm:block ${
                              isActive
                                ? "text-neutral-800 dark:text-white"
                                : "text-neutral-400 dark:text-neutral-600"
                            }`}
                          >
                            {statusLabel[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CONDITIONAL RICH DETAILS OR SIMPLE PREVIEW LIST */}
                <div className="pt-4 divide-y divide-neutral-100 dark:divide-neutral-900 border-t border-neutral-50 dark:border-neutral-900/50">
                  {order.items.map((item, idx) => {
                    // Try to resolve rich imagery once details are fetched
                    const resolvedProduct = detailedProduct[item.productId];
                    const activeVariant =
                      resolvedProduct?.variants?.find(
                        (v) =>
                          v.color.toLowerCase() === item.color?.toLowerCase(),
                      ) ?? resolvedProduct?.variants?.[0];
                    const designImg = activeVariant?.designs?.[0]?.images?.[0];
                    const fallbackImg =
                      activeVariant?.images?.[0] ||
                      resolvedProduct?.variants?.[0]?.images?.[0];
                    const itemImage = designImg || fallbackImg;

                    const itemContent = (
                      <>
                        {/* Immersive Thumbnail Showcase (Dynamic image loader!) */}
                        {isExpanded && (
                          <div className="relative w-12 h-16 rounded-md overflow-hidden border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 shrink-0 shadow-xs flex-none">
                            {itemImage ? (
                              <Image
                                src={itemImage}
                                alt={item.name}
                                fill
                                className="object-cover object-top pointer-events-none"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 animate-pulse">
                                <Package
                                  size={14}
                                  className="text-neutral-300"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold text-neutral-800 dark:text-white truncate uppercase tracking-wide leading-snug ${resolvedProduct ? "group-hover/item:text-[#6A0F1F] dark:group-hover/item:text-[#e4e198] transition-colors duration-200" : ""}`}
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 font-medium uppercase tracking-wider">
                            Size: {item.size} <span className="mx-1">·</span>{" "}
                            Qty: {item.quantity}{" "}
                            {item.color ? (
                              <>
                                <span className="mx-1">·</span> Color:{" "}
                                {item.color}
                              </>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>

                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 shrink-0 font-sans">
                          ₹{Math.round(item.total)}
                        </span>
                      </>
                    );

                    if (resolvedProduct) {
                      const slug = createSlug(
                        resolvedProduct.name,
                        resolvedProduct.productId,
                      );
                      const cat = resolvedProduct.category.toLowerCase();
                      const colorParam = item.color
                        ? `?color=${item.color}`
                        : "";

                      return (
                        <Link
                          key={idx}
                          href={`/${cat}/${slug}${colorParam}`}
                          className="flex gap-4 py-4 items-center group/item hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 px-2 rounded-lg transition duration-200 cursor-pointer"
                        >
                          {itemContent}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 py-4 items-center px-2"
                      >
                        {itemContent}
                      </div>
                    );
                  })}
                </div>

                {/* 4. TOTALS ROW SUMMARY */}
                <div className="flex justify-between items-center font-semibold text-xs border-t border-neutral-100 dark:border-neutral-900 pt-5">
                  <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-[9px] font-bold">
                    <CreditCard size={12} />
                    <span>Total Amount Paid</span>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-wide">
                    ₹{Math.round(order.totalAmount)}
                  </span>
                </div>

                {/* Address & Payment Details block (Shows expanded address & payment details if expanded!) */}
                {isExpanded && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Delivery Address block */}
                    <div className="border border-neutral-100 dark:border-neutral-900 rounded-xl p-4 bg-[#fcfbfa]/50 dark:bg-black/50 text-xs space-y-2 select-none animate-fadeIn">
                      <h4 className="font-bold uppercase tracking-wider text-neutral-800 dark:text-white text-[9px] flex items-center gap-1.5">
                        <MapPin size={11} className="text-neutral-400" />
                        <span>Delivery Information</span>
                      </h4>
                      <div className="text-neutral-500 dark:text-neutral-400 font-light space-y-1 pl-4 leading-relaxed font-sans">
                        <p>{order.deliveryAddress.address}</p>
                        <p className="font-semibold text-neutral-600 dark:text-neutral-300 mt-1">
                          Phone: {order.deliveryAddress.phone}
                        </p>
                      </div>
                    </div>

                    {/* Payment Information block */}
                    <div className="border border-neutral-100 dark:border-neutral-900 rounded-xl p-4 bg-[#fcfbfa]/50 dark:bg-black/50 text-xs space-y-2 select-none animate-fadeIn">
                      <h4 className="font-bold uppercase tracking-wider text-neutral-800 dark:text-white text-[9px] flex items-center gap-1.5">
                        <CreditCard size={11} className="text-neutral-400" />
                        <span>Payment Information</span>
                      </h4>
                      <div className="text-neutral-500 dark:text-neutral-400 font-light space-y-1.5 pl-4 leading-relaxed font-sans mt-2">
                        <p className="flex justify-between">
                          <span className="text-neutral-400 font-medium">
                            Payment Method:
                          </span>
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px]">
                            {order.paymentMethod === "COD"
                              ? "Cash On Delivery (COD)"
                              : `Online Payment (${order.paymentMethod || "Prepaid"})`}
                          </span>
                        </p>
                        <p className="flex justify-between border-t border-neutral-100/30 dark:border-neutral-900/30 pt-1.5">
                          <span className="text-neutral-400 font-medium">
                            Payment Status:
                          </span>
                          <span
                            className={`font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-sm ${
                              order.paymentStatus === "Paid"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. EDITORIAL BOTTOM CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* Expanded trigger toggle */}
                  <button
                    onClick={async () => {
                      if (isExpanded) {
                        setExpandedOrderId(null);
                        return;
                      }

                      setExpandedOrderId(order._id);
                      toast.loading("Loading order details...");
                      await loadDetailedProducts(order);
                      toast.dismiss();
                    }}
                    className="flex-1 py-3 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-widest rounded-md transition duration-200 cursor-pointer flex items-center justify-center gap-2 select-none bg-white dark:bg-neutral-950"
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    <ChevronDown
                      size={12}
                      className={`text-neutral-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* PDF download invoice trigger (Opens in new tab so user has option to print or download) */}
                  <button
                    onClick={() => {
                      toast.info("Opening Invoice in new tab...");
                      window.open(
                        `/api/orders/${order.orderNumber}/invoice`,
                        "_blank",
                      );
                    }}
                    className="flex-1 py-3 bg-neutral-900 hover:bg-black dark:bg-neutral-900 dark:hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download size={12} strokeWidth={2} />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPageClient;
