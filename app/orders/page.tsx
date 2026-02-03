"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  _id: string;
  items: {
    title: string;
    price: number;
    qty: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryAddress: {
    address: string;
    phone: string;
  };
};

const STATUS_STEPS = [
  "pending",
  "paid",
  "packing",
  "shipping",
  "delivered",
];

const statusLabel: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  packing: "Packing",
  shipping: "Shipped",
  delivered: "Delivered",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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

  if (loading) {
    return <div className="p-10 text-lg">Loading your orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-lg text-gray-600">
        You haven’t placed any orders yet.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.map((order) => {
        const currentStep = STATUS_STEPS.indexOf(order.status);

        return (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-5 mb-8 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm px-3 py-1 rounded-full bg-black text-white">
                {statusLabel[order.status] || order.status}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="flex items-center gap-2 mb-4">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-2 w-full">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      idx <= currentStep
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  />
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        idx < currentStep
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="space-y-1 text-sm">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-gray-700"
                >
                  <span className="line-clamp-1">
                    {item.title}
                  </span>
                  <span>
                    x{item.qty} · ₹{Math.round(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-3" />

            {/* Total */}
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{Math.round(order.totalAmount)}</span>
            </div>

            {/* Address */}
            <div className="mt-3 text-sm text-gray-600">
              <p>{order.deliveryAddress.address}</p>
              <p>{order.deliveryAddress.phone}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPage;
