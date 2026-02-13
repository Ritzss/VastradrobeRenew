import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: { type: String },

    /* 🛒 CART */
    cart: [
      {
        productId: Number,
        size: String,
        qty: Number,
      },
    ],

    /* 📍 ADDRESS */
    deliveryAddress: {
      address: { type: String },
      phone: { type: String },
    },

    /* ❤️ FAVORITES (NEW) */
    favorites: {
      type: Map,
      of: [Number],
      default: {
        Favorites: [],
      },
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
