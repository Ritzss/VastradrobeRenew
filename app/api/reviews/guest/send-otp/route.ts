import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // 1. Rate limit OTP requests
    // --------------------------------------------------
    // Guest reviews must have the same protection as login OTPs.
    // This prevents SMS spam and unnecessary MSG91 charges.
    const ip = getClientIp(req);

    const isAllowed = rateLimit(
      ip,
      3,
      60 * 1000,
    );

    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many OTP requests. Please wait 60 seconds before trying again.",
        },
        {
          status: 429,
        },
      );
    }

    // --------------------------------------------------
    // 2. Get and validate the phone number
    // --------------------------------------------------
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required",
        },
        {
          status: 400,
        },
      );
    }

    // Only allow valid Indian mobile numbers.
    const isMobile = /^[6-9]\d{9}$/.test(identifier);

    if (!isMobile) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number",
        },
        {
          status: 400,
        },
      );
    }

    // --------------------------------------------------
    // 3. Return MSG91 provider information
    // --------------------------------------------------
    // The actual OTP is handled by the MSG91 widget on the
    // client side, just like the existing mobile login flow.
    return NextResponse.json({
      success: true,
      provider: "msg91",
    });
  } catch (error) {
    console.error(
      "GUEST REVIEW OTP SEND ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}