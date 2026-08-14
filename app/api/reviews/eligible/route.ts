import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

import Order from "@/model/Order";
import Review from "@/model/ProductReviews";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Authenticate the logged-in user
    // --------------------------------------------------
    // API routes bypass the global middleware, so we verify
    // the JWT directly inside this endpoint.
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    let payload;

    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 },
      );
    }

    // Get the authenticated user's ID from the JWT.
    const userId = payload.userId || payload.id || payload._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId.toString())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user session",
        },
        { status: 401 },
      );
    }

    // --------------------------------------------------
    // 2. Get and validate the product ID
    // --------------------------------------------------
    const { searchParams } = new URL(req.url);

    const productId = Number(searchParams.get("productId"));

    if (!productId || !Number.isInteger(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid productId is required",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 3. Find delivered orders containing this product
    // --------------------------------------------------
    // Product information belongs to IMS.
    // Orders remain the source of truth for whether this customer
    // actually purchased the product.
    const orders = await Order.find({
      userId,
      status: "delivered",
      "items.productId": productId,
    })
      .select("_id orderNumber items createdAt")
      .lean();

    // No delivered purchase means the user cannot submit
    // a verified review for this product.
    if (!orders.length) {
      return NextResponse.json({
        success: true,
        hasPurchased: false,
        eligible: false,
        purchases: [],
        reviewedPurchases: [],
      });
    }

    // --------------------------------------------------
    // 4. Separate purchases into:
    //    - products still eligible for review
    //    - products already reviewed
    // --------------------------------------------------
    const purchases = [];
    const reviewedPurchases = [];

    for (const order of orders) {
      for (const item of order.items) {
        // Ignore other products from the same order.
        if (Number(item.productId) !== productId) {
          continue;
        }

        const color = item.color || "";
        const design = item.design || "";

        // Check whether this exact product + variant from this
        // specific order has already been reviewed.
        const existingReview = await Review.findOne({
          userId,
          orderId: order._id,
          productId,
          "variant.color": color,
          "variant.design": design,
        })
          .select("_id rating createdAt")
          .lean();

        // Common purchase information returned to the PDP.
        const purchase = {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          productId,

          variant: {
            color,
            design,
          },

          size: item.size,
          quantity: item.quantity,
          purchasedAt: order.createdAt,
        };

        if (existingReview) {
          // The customer already reviewed this exact purchase/variant.
          // Return it separately so the PDP can display "Reviewed".
          reviewedPurchases.push({
            ...purchase,
            reviewId: existingReview._id.toString(),
            rating: existingReview.rating,
            reviewedAt: existingReview.createdAt,
          });
        } else {
          // This purchased variant is still eligible for a review.
          purchases.push(purchase);
        }
      }
    }

    // --------------------------------------------------
    // 5. Return the review eligibility information
    // --------------------------------------------------
    return NextResponse.json({
      success: true,
      // The customer has purchased this product at least once.
      hasPurchased: orders.length > 0,
      eligible: purchases.length > 0,
      purchases,
      reviewedPurchases,
    });
  } catch (error) {
    console.error("Failed to check review eligibility:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check review eligibility",
      },
      { status: 500 },
    );
  }
}
