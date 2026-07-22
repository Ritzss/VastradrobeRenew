import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
      // Random password because checkout users don't create one
      //   const randomPassword = Math.random().toString(36).slice(-12);

      //   const hashedPassword = await bcrypt.hash(randomPassword, 10);

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
      // Keep latest delivery details
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
