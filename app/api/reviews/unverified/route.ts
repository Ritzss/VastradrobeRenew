/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

import Review from "@/model/ProductReviews";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type AuthJWTPayload = {
  userId?: string;
  id?: string;
  _id?: string;
  username?: string;
};

export async function POST(req: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Read request body
    // --------------------------------------------------
    const body = await req.json();

    const {
      productId,
      rating,
      comment,
      variant,
      isAnonymous = false,

      // Used only for guest reviews.
      verificationToken,

      // Guest display name.
      name,
    } = body;

    // --------------------------------------------------
    // 2. Validate basic review information
    // --------------------------------------------------
    const numericProductId = Number(productId);
    const numericRating = Number(rating);

    if (!productId || !Number.isInteger(numericProductId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid productId is required",
        },
        { status: 400 },
      );
    }

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
    // 3. Determine whether this is a logged-in user
    //    or an OTP-verified guest.
    // --------------------------------------------------
    const loginToken = req.cookies.get("token")?.value;

    let userId: mongoose.Types.ObjectId | null = null;
    let displayName = "";
    let verifiedMobile = "";

    // ==================================================
    // PATH A: LOGGED-IN USER
    // ==================================================
    if (loginToken) {
      try {
        const { payload } = await jwtVerify(loginToken, secret);

        const authPayload = payload as AuthJWTPayload;

        const authenticatedUserId =
          authPayload.userId || authPayload.id || authPayload._id;

        if (
          authenticatedUserId &&
          mongoose.Types.ObjectId.isValid(authenticatedUserId.toString())
        ) {
          userId = new mongoose.Types.ObjectId(authenticatedUserId.toString());

          displayName = isAnonymous
            ? "Anonymous Customer"
            : payload.username?.toString() || "Customer";
        }
      } catch {
        // If the login token is invalid, we simply fall
        // through to the guest verification path.
        userId = null;
      }
    }

    // ==================================================
    // PATH B: OTP-VERIFIED GUEST
    // ==================================================
    if (!userId) {
      // A guest MUST provide the short-lived verification
      // token generated after successful MSG91 verification.
      if (!verificationToken) {
        return NextResponse.json(
          {
            success: false,
            message: "Phone verification is required",
          },
          { status: 401 },
        );
      }

      try {
        const verified = await jwtVerify(verificationToken, secret);

        // Make sure this JWT was specifically created
        // for guest review phone verification.
        if (verified.payload.purpose !== "guest-review-phone-verification") {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid review verification token",
            },
            { status: 401 },
          );
        }

        verifiedMobile = verified.payload.mobile?.toString() || "";

        if (!verifiedMobile) {
          return NextResponse.json(
            {
              success: false,
              message: "Verified mobile number is missing",
            },
            { status: 401 },
          );
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Phone verification has expired. Please verify again.",
          },
          { status: 401 },
        );
      }

      // Guests must provide a display name.
      if (!name?.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Name is required",
          },
          { status: 400 },
        );
      }

      displayName = isAnonymous ? "Anonymous Customer" : name.trim();
    }

    // --------------------------------------------------
    // 4. Prevent duplicate reviews
    // --------------------------------------------------
    //
    // Logged-in users:
    //   userId + product + variant
    //
    // Guests:
    //   phone + product + variant
    //
    // This prevents the same person from repeatedly
    // submitting reviews for the same variant.
    // --------------------------------------------------
    const duplicateQuery: any = {
      productId: numericProductId,
      "variant.color": variant?.color?.trim() || "",
      "variant.design": variant?.design?.trim() || "",
    };

    if (userId) {
      duplicateQuery.userId = userId;
    } else {
      duplicateQuery.phone = verifiedMobile;
    }

    const existingReview = await Review.findOne(duplicateQuery)
      .select("_id")
      .lean();

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already reviewed this product variant.",
        },
        { status: 409 },
      );
    }

    // --------------------------------------------------
    // 5. Create the review
    // --------------------------------------------------
    const review = await Review.create({
      productId: numericProductId,

      // Logged-in users have a userId.
      // Guests intentionally do not.
      userId,

      // Unverified reviews are not associated with
      // a delivered order.
      orderId: null,

      displayName,

      // Store the verified phone number for guests.
      // Logged-in users don't need this here.
      phone: verifiedMobile || null,

      isAnonymous: Boolean(isAnonymous),

      rating: numericRating,

      comment: comment?.trim() || "",

      variant: {
        color: variant?.color?.trim() || "",
        design: variant?.design?.trim() || "",
      },

      // IMPORTANT:
      // This endpoint is ONLY for non-purchase reviews.
      verifiedPurchase: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unverified review submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting the review",
      },
      { status: 500 },
    );
  }
}
