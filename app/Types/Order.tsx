export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  size: string; // 👈 single size, not array
  qty: number;
  image?: string;
};

export type Order = {
  _id: string;
  userId: string; // ObjectId as string in TS

  items: OrderItem[];

  deliveryAddress: {
    address: string;
    phone: string;
  };

  totalAmount: number;

  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";

  payment?: {
    provider?: string;
    orderId?: string;
    paymentId?: string;
  };

  createdAt: Date;
  updatedAt: Date;
};
