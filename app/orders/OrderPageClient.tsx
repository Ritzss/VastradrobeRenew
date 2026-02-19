"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IMSProduct } from "@/Types/Product";
import { Order } from "@/Types/Order";
import Image from "next/image";

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

  const loadDetailedProducts = async (order: Order) => {
    for (const item of order.items) {
      if (detailedProduct[item.productId]) continue;

      const res = await fetch(`${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products/${item.productId}`,
        { next: { revalidate: 120 } }
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.map((order) => {
        const currentStep = STATUS_STEPS.indexOf(order.status);

        return (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-5 mb-8 shadow-sm transition-all duration-500"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
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
                      idx <= currentStep ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        idx < currentStep ? "bg-green-600" : "bg-gray-200"
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
                  className="flex justify-between gap-5 text-gray-700"
                >
                  <span>
                    <span className="line-clamp-2">
                      Product Name:
                      {item.name}
                    </span>
                    <span className="line-clamp-2">
                      Size:
                      {item.size}
                    </span>
                  </span>
                  <span>
                    x{item.qty} · ₹{Math.round(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-3 space-y-3 text-sm bg-gray-50 p-3 rounded-lg">
                {order.items.map((item, idx) => {
                  const product = detailedProduct[item.productId];
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 items-start border-b pb-2 last:border-none"
                    >
                      <div className="relative w-40 h-50 rounded-xl overflow-hidden">
                        {product && (
                        <Image
                        fill
                        sizes="photo"
                          src={item.image?.[0] || "/Assets/Images/Newplaceholder.png"}
                          alt={product.name}
                          className=" "
                        />
                      )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">Size: {item.size}</p>
                        <p className="text-gray-600">Qty: {item.qty}</p>
                      </div>

                      <div className="text-right">
                        <p>₹{item.price}</p>
                        <p className="font-semibold">
                          ₹{item.price * item.qty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

            <button
              onClick={async () => {
                if (expandedOrderId === order._id) {
                  setExpandedOrderId(null);
                  return;
                }

                setExpandedOrderId(order._id);
                await loadDetailedProducts(order);
              }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              {expandedOrderId === order._id ? "Hide Details" : "View Details"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersPageClient;
