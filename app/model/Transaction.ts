import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  transactionNumber: string;

  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  provider: "razorpay";

  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;

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
}

const TransactionSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      unique: true,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: String,
      default: "razorpay",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    subtotal: {
      type: Number,
      required: true,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: String,

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },

    invoiceNumber: String,

    invoiceUrl: String,

    currency: {
      type: String,
      default: "INR",
    },

    notes: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
