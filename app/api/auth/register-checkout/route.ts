import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { username, mobile, address } = await req.json();

    if (!username || !mobile || !address) {
      return NextResponse.json(
        {
          message: "Username, mobile number and address are required",
        },
        {
          status: 400,
        },
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        {
          message: "Please enter a valid 10-digit mobile number",
        },
        {
          status: 400,
        },
      );
    }

    await connectDB();

    let user = await User.findOne({ mobile });

    if (!user) {
      // Create a fresh guest user with no password
      user = await User.create({
        username,
        mobile,
        password: null,
        isPasswordSet: false,

        deliveryAddress: {
          address,
          phone: mobile,
        },
      });
    } else {
      // 🔒 SECURITY CHECK: If this user is an active registered member with a password set,
      // prevent unauthenticated takeovers. Force them to log in through normal channels.
      if (user.password !== null && user.isPasswordSet) {
        return NextResponse.json(
          {
            message:
              "An active account with this mobile number already exists. Please log in to your account.",
            code: "AUTH_REQUIRED",
          },
          {
            status: 409, // Conflict
          },
        );
      }

      // If the existing user is only a guest checkout account (no password),
      // we can safely update their latest delivery details and proceed.
      user.username = username;
      user.deliveryAddress = {
        address,
        phone: mobile,
      };

      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    const response = NextResponse.json(
      {
        message: "Checkout login successful",
      },
      {
        status: 200,
      },
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("CHECKOUT REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
