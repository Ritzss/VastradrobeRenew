import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { identifier, token } = await req.json();

    if (!identifier || !token) {
      return NextResponse.json(
        {
          message: "Missing identifier or access token",
        },
        {
          status: 400,
        }
      );
    }

    // Verify access token with MSG91
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
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      console.error("MSG91 VERIFY ERROR:", verifyData);

      return NextResponse.json(
        {
          message: "OTP verification failed",
        },
        {
          status: 401,
        }
      );
    }

    // Optional but recommended: ensure MSG91 actually verified success
    if (
      verifyData.type !== "success" &&
      verifyData.message !== "success"
    ) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const user = await User.findOne({
      mobile: identifier,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Account not found",
        },
        {
          status: 404,
        }
      );
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("MSG91 LOGIN ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}