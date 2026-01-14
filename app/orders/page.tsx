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
      setOrders(data.orders);
      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return <div className="p-10 text-xl">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-10 text-xl">No orders yet</div>;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-4 mb-6 shadow-sm"
        >
          <div className="flex justify-between mb-2">
            <span className="font-semibold">
              Order ID: {order._id.slice(-6)}
            </span>
            <span className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-2 text-sm">
            <strong>Status:</strong>{" "}
            <span className="text-green-600">{order.status}</span>
          </div>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between text-sm mb-1"
            >
              <span className="line-clamp-1">{item.title}</span>
              <span>
                x{item.qty} · ₹{Math.round(item.price * 100)}
              </span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{Math.round(order.totalAmount * 100)}</span>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <div>{order.deliveryAddress?.address}</div>
            <div>{order.deliveryAddress?.phone}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
