/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";
import User from "@/model/User";
import Order from "@/model/Order";
import Review from "@/model/ProductReviews";

// import Review from "../model/ProductReviews";
// import Order from "../model/Order";
// import User from "../model/User";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Authenticate the logged-in user
    // --------------------------------------------------
    // API routes are allowed through the global middleware,
    // so the JWT must be verified explicitly inside this route.
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

    // Use the user ID stored in the JWT.
    // Adjust this once we confirm the exact field used by your login code.
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
    // 2. Get the user's account information
    // --------------------------------------------------
    // The frontend should not be trusted to provide the reviewer's
    // display name. We get it directly from the authenticated account.
    // Fetch the username from the authenticated user's account.
    // This is used as the public display name unless the review is anonymous.
    const user = await User.findById(userId).select("username");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // --------------------------------------------------
    // 3. Read and validate the request body
    // --------------------------------------------------
    const body = await req.json();

    const {
      productId,
      orderId,
      rating,
      comment,
      variant,
      isAnonymous = false,
    } = body;

    if (!productId || !orderId || rating === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "productId, orderId and rating are required",
        },
        { status: 400 },
      );
    }

    const numericProductId = Number(productId);
    const numericRating = Number(rating);

    if (!Number.isInteger(numericProductId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID",
        },
        { status: 400 },
      );
    }

    // Only whole-number ratings from 1 to 5 are accepted.
    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 4. Validate the order ID
    // --------------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 5. Find the order belonging to this user
    // --------------------------------------------------
    // This prevents a user from submitting a review using
    // somebody else's order ID.
    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or does not belong to you",
        },
        { status: 404 },
      );
    }

    // --------------------------------------------------
    // 6. Only delivered orders can create verified reviews
    // --------------------------------------------------
    if (order.status !== "delivered") {
      return NextResponse.json(
        {
          success: false,
          message: "You can review a product only after it has been delivered",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 7. Verify that the product and selected variant
    //    were actually purchased in this order
    // --------------------------------------------------
    const requestedColor = variant?.color?.trim() || "";
    const requestedDesign = variant?.design?.trim() || "";

    const orderItem = order.items.find(
      (item: { productId: any; color: any; design: any }) => {
        // Product must match.
        if (Number(item.productId) !== numericProductId) {
          return false;
        }

        // If a color was supplied, it must match the purchased item.
        if (requestedColor && (item.color || "").trim() !== requestedColor) {
          return false;
        }

        // If a design was supplied, it must match the purchased item.
        if (requestedDesign && (item.design || "").trim() !== requestedDesign) {
          return false;
        }

        return true;
      },
    );

    if (!orderItem) {
      return NextResponse.json(
        {
          success: false,
          message: "This product or variant was not part of this order",
        },
        { status: 403 },
      );
    }

    // --------------------------------------------------
    // 8. Prevent duplicate reviews for this purchase
    // --------------------------------------------------
    // A customer can review the same product again in a different
    // order, but cannot submit multiple reviews for the same order.
    // Prevent reviewing the exact same purchased variant twice.
    // Different variants from the same order can still have separate reviews.
    const existingReview = await Review.findOne({
      userId,
      orderId,
      productId: numericProductId,
      "variant.color": orderItem.color || requestedColor || "",
      "variant.design": orderItem.design || requestedDesign || "",
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already reviewed this product from this order",
        },
        { status: 409 },
      );
    }

    // --------------------------------------------------
    // 9. Create the verified review
    // --------------------------------------------------
    // The server determines verifiedPurchase instead of trusting
    // a value sent by the frontend.
    const review = await Review.create({
      productId: numericProductId,

      userId,

      orderId,

      displayName: isAnonymous ? "Anonymous Customer" : user.username,

      // Logged-in reviews do not need the phone number.
      phone: null,

      isAnonymous: Boolean(isAnonymous),

      rating: numericRating,

      comment: comment?.trim() || "",

      // Store the actual purchased variant.
      // The order is our source of truth, not the frontend.
      variant: {
        color: orderItem.color || requestedColor || "",
        design: orderItem.design || requestedDesign || "",
      },

      verifiedPurchase: true,
    });

    // --------------------------------------------------
    // 10. Recalculate the product's rating
    // --------------------------------------------------
    // Product data belongs to IMS, so we do NOT update the Product
    // document here. The rating is calculated from VastraDrobe's
    // Review collection and will be combined with IMS product data
    // when the PDP loads.
    const ratingStats = await Review.aggregate([
      {
        $match: {
          productId: numericProductId,
        },
      },
      {
        $group: {
          _id: "$productId",

          averageRating: {
            $avg: "$rating",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const stats = ratingStats[0];

    const averageRating = stats ? Number(stats.averageRating.toFixed(1)) : 0;

    const ratingCount = stats ? stats.count : 0;

    // --------------------------------------------------
    // 11. Return the newly created review and updated rating
    // --------------------------------------------------
    return NextResponse.json(
      {
        success: true,

        message: "Review submitted successfully",

        review,

        rating: {
          average: averageRating,
          count: ratingCount,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Review submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting the review",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Read query parameters
    // --------------------------------------------------
    // productId identifies the IMS product whose reviews
    // we want to retrieve.
    const { searchParams } = new URL(req.url);

    const productId = Number(searchParams.get("productId"));

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);

    // --------------------------------------------------
    // 2. Validate product ID
    // --------------------------------------------------
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
    // 3. Calculate pagination
    // --------------------------------------------------
    const skip = (page - 1) * limit;

    // --------------------------------------------------
    // 4. Fetch reviews and total count
    // --------------------------------------------------
    // Reviews are stored in VastraDrobe's database.
    // Product information itself remains owned by IMS.
    const [reviews, totalReviews] = await Promise.all([
      Review.find({ productId })
        .select(
          "displayName isAnonymous rating comment variant verifiedPurchase createdAt",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments({ productId }),
    ]);

    // --------------------------------------------------
    // 5. Calculate rating distribution
    // --------------------------------------------------
    // This tells the PDP how many customers gave each
    // star rating, allowing us to display a breakdown such as:
    //
    // 5 ★  █████████████
    // 4 ★  ███████
    // 3 ★  ██
    // 2 ★  █
    // 1 ★
    const distribution = await Review.aggregate([
      {
        $match: {
          productId,
        },
      },

      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    // --------------------------------------------------
    // 6. Convert distribution into a predictable object
    // --------------------------------------------------
    // We always return all five ratings, even when a rating
    // has zero reviews. This makes frontend rendering simpler.
    type RatingKey = 5 | 4 | 3 | 2 | 1;

    const ratingDistribution: Record<RatingKey, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    distribution.forEach((item: { _id: number; count: number }) => {
      const rating = Number(item._id) as RatingKey;

      if (rating in ratingDistribution) {
        ratingDistribution[rating] = item.count;
      }
    });

    // --------------------------------------------------
    // 7. Calculate overall rating
    // --------------------------------------------------
    const ratingStats = await Review.aggregate([
      {
        $match: {
          productId,
        },
      },

      {
        $group: {
          _id: "$productId",

          averageRating: {
            $avg: "$rating",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const stats = ratingStats[0];

    const averageRating = stats ? Number(stats.averageRating.toFixed(1)) : 0;

    const totalPages = Math.ceil(totalReviews / limit);

    // --------------------------------------------------
    // 8. Return review data for the PDP
    // --------------------------------------------------
    return NextResponse.json({
      success: true,

      rating: {
        average: averageRating,
        count: totalReviews,
        distribution: ratingDistribution,
      },

      reviews,

      pagination: {
        page,
        limit,
        totalReviews,
        totalPages,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load reviews",
      },
      { status: 500 },
    );
  }
}
