import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { identifier, token } = await req.json();

    // --------------------------------------------------
    // 1. Validate the request
    // --------------------------------------------------
    if (!identifier || !token) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing phone number or access token",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 2. Verify the MSG91 access token
    // --------------------------------------------------
    // The OTP itself has already been handled by MSG91.
    // We only need to verify the access token returned after
    // successful OTP verification.
    const verifyRes = await fetch(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          authkey: process.env.MSG91_AUTH_KEY,
          "access-token": token,
        }),
      },
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      console.error(
        "MSG91 REVIEW OTP VERIFY ERROR:",
        verifyData,
      );

      return NextResponse.json(
        {
          success: false,
          message: "OTP verification failed",
        },
        { status: 401 },
      );
    }

    // MSG91 should explicitly report successful verification.
    if (
      verifyData.type !== "success" &&
      verifyData.message !== "success"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 401 },
      );
    }

    // --------------------------------------------------
    // 3. Create a short-lived review verification token
    // --------------------------------------------------
    // This token proves that the submitted phone number passed
    // OTP verification.
    //
    // IMPORTANT:
    // This is NOT the normal login JWT and does not create
    // an authenticated user session.
    const reviewVerificationToken = jwt.sign(
      {
        purpose: "guest-review-phone-verification",
        mobile: identifier,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15m",
      },
    );

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      verificationToken: reviewVerificationToken,
    });
  } catch (error) {
    console.error(
      "GUEST REVIEW OTP ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}