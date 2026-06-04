"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IMSProduct } from "@/Types/Product";
import { Order } from "@/Types/Order";
import Image from "next/image";
import EmptyState from "@/components/Global/EmptyState";

const STATUS_STEPS = ["pending", "paid", "packing", "shipping", "delivered"];

const statusLabel: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  packing: "Packing",
  shipping: "Shipped",
  delivered: "Delivered",
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
      const res = await fetch("/api/orders/my");

      if (res.status === 401) {
        router.push("/account/login");
        return;
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f5ef] flex items-center justify-center">
        <EmptyState
          label="No Orders Yet"
          title="Your Wardrobe Awaits"
          description="You haven’t placed any orders yet. Discover timeless pieces crafted with care."
          buttonText="Explore Collections →"
          buttonLink="/"
        />
      </div>
    );
  }

  const loadDetailedProducts = async (order: Order) => {
    for (const item of order.items) {
      if (detailedProduct[item.productId]) continue;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products/${item.productId}`,
        { next: { revalidate: 120 } },
      );
      if (!res.ok) continue;

      const data = await res.json();

      setDetailedProduct((prev) => ({
        ...prev,
        [item.productId]: data.product,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5ef] px-6 md:px-16 py-16 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#5f5143]">
            My Orders
          </h1>
          <p className="text-sm text-[#7a6a5c] mt-2">
            Track and manage your purchases.
          </p>
        </div>

        {orders.map((order) => {
          const currentStep = STATUS_STEPS.indexOf(order.status);

          return (
            <div
              key={order._id}
              className=" bg-white rounded-[32px] shadow-[0_30px_80px_rgba(149,127,106,0.15)] p-8 mb-12 transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="font-semibold text-[#5f5143]">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-[#7a6a5c]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span className="text-xs px-4 py-2 rounded-full bg-[#6a0f1f] text-white">
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 mb-8">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step} className="flex items-center gap-2 w-full">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        idx <= currentStep ? "bg-[#6a0f1f]" : "bg-[#e6d8c8]"
                      }`}
                    />
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-[2px] ${
                          idx < currentStep ? "bg-[#6a0f1f]" : "bg-[#e6d8c8]"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Items */}
              <div className="space-y-3 text-sm">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-[#5f5143]"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-[#7a6a5c]">
                        Size: {item.size} · Qty: {item.qty}
                      </p>
                    </div>
                    <span>₹{Math.round(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between font-semibold mt-6 text-[#5f5143] border-t border-[#e6d8c8] pt-6">
                <span>Total</span>
                <span>₹{Math.round(order.totalAmount)}</span>
              </div>

              {/* Address */}
              <div className="mt-6 text-sm text-[#7a6a5c]">
                <p>{order.deliveryAddress.address}</p>
                <p>{order.deliveryAddress.phone}</p>
              </div>

              {/* Expand */}
              <button
                onClick={async () => {
                  if (expandedOrderId === order._id) {
                    setExpandedOrderId(null);
                    return;
                  }

                  setExpandedOrderId(order._id);
                  await loadDetailedProducts(order);
                }}
                className=" mt-6 text-sm text-[#6a0f1f] hover:underline transition"
              >
                {expandedOrderId === order._id
                  ? "Hide Details"
                  : "View Details"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPageClient;
