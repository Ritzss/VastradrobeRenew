import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Unique identifiers
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },

    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },

    items: [
      {
        productId: Number,

        name: {
          type: String,
          required: true,
        },

        sku: String,

        color: String,

        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        total: {
          type: Number,
          required: true,
        },

        image: [String],
      },
    ],

    deliveryAddress: {
      name: String,
      email: String,
      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
    },

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

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "UPI", "Card", "Net Banking"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "packing",
        "shipping",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
    },

    payment: {
      provider: String,
      orderId: String,
      paymentId: String,
      signature: String,
    },

    invoiceUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
