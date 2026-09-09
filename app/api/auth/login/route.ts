import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        {
          message: "Email/Mobile and password are required",
        },
        {
          status: 400,
        },
      );
    }

    await connectDB();

    const user = await User.findOne({
      $or: [
        {
          email: identifier.toLowerCase(),
        },
        {
          mobile: identifier,
        },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "No user found. Please register first.",
        },
        {
          status: 401,
        },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
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
        message: "Login successful",
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
    console.error("LOGIN ERROR:", error);

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
