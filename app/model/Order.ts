import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: Number,
        name: String,
        color: String,
        price: Number,
        size: {
          type: String,
          required: true,
        },
        qty: Number,
        image: [{ type: String }],
      },
    ],

    deliveryAddress: {
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    payment: {
      provider: String,
      orderId: String,
      paymentId: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
