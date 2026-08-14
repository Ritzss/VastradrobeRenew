import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    // IMS product identifier.
    // Product data itself is owned by IMS; VastraDrobe only stores
    // this ID to associate reviews with the correct product.
    productId: {
      type: Number,
      required: true,
      index: true,
    },

    // Logged-in user's account.
    // Null for reviews submitted through the logged-out OTP flow.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // The order used to verify the purchase.
    // Null when the reviewer has not purchased the product.
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // Name displayed publicly with the review.
    // For anonymous reviews this will be "Anonymous Customer".
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    // Stored privately for the logged-out OTP review flow.
    // This should never be exposed in the public review API.
    phone: {
      type: String,
      default: null,
    },

    // Logged-in users can choose whether their account name
    // or "Anonymous Customer" is displayed publicly.
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // Customer rating from 1 to 5 stars.
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Optional written review.
    comment: {
      type: String,
      trim: true,
      default: "",
    },

    // The specific product variant that was reviewed.
    // We currently identify variants using color + design.
    variant: {
      color: {
        type: String,
        default: "",
      },

      design: {
        type: String,
        default: "",
      },
    },

    // True only when the server confirms that the customer
    // purchased the product through a valid delivered order.
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Automatically creates createdAt and updatedAt.
    timestamps: true,
  },
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);