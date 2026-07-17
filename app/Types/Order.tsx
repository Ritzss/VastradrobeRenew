export type OrderItem = {
  productId: number;

  name: string;

  sku?: string;

  color?: string;

  size: string;

  quantity: number;

  price: number;

  total: number;

  image: string[];
};

export type Transaction = {
  _id: string;

  transactionNumber: string;

  provider: "razorpay";

  razorpayOrderId: string;

  razorpayPaymentId: string;

  razorpaySignature?: string;

  subtotal: number;

  shippingCharge: number;

  discount: number;

  tax: number;

  totalAmount: number;

  paymentMethod: string;

  status: "pending" | "paid" | "failed" | "refunded";

  invoiceNumber?: string;

  invoiceUrl?: string;

  currency: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
};

export type Order = {
  _id: string;

  userId: string;

  transactionId?: string | Transaction;

  orderNumber: string;

  invoiceNumber: string;

  items: OrderItem[];

  deliveryAddress: {
    name?: string;

    email?: string;

    address: string;

    phone: string;

    city?: string;

    state?: string;

    pincode?: string;

    country?: string;
  };

  subtotal: number;

  shippingCharge: number;

  discount: number;

  tax: number;

  totalAmount: number;

  paymentMethod: "COD" | "Razorpay" | "UPI" | "Card" | "Net Banking";

  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";

  status:
    | "pending"
    | "paid"
    | "packing"
    | "shipping"
    | "delivered"
    | "cancelled";

  payment?: {
    provider?: string;

    orderId?: string;

    paymentId?: string;

    signature?: string;
  };

  invoiceUrl?: string;

  createdAt: Date;

  updatedAt: Date;
};