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
    /* 🛒 CART */
    cart: [
      {
        productId: {
          type: Number,
          required: true,
        },

        color: {
          type: String,
          required: true,
        },

        size: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          default: 1,
        },
      },
    ],

    /* 💾 SAVED FOR LATER */
    savedForLater: [
      {
        productId: {
          type: Number,
          required: true,
        },

        color: {
          type: String,
          required: true,
        },

        size: {
          type: String,
          required: true,
        },

        qty: {
          type: Number,
          default: 1,
        },
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
    /*Authentication For reset */
    resetOtp: {
      type: String,
    },

    resetVerified: {
      type: Boolean,
      default: false,
    },

    resetOtpExpiry: {
      type: Date,
    },

    resetOtpAttempts: {
      type: Number,
      default: 0,
    },

    loginOtp: {
      type: String,
    },

    loginOtpExpiry: {
      type: Date,
    },

    loginOtpAttempts: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
