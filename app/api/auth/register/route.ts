import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    // Read body
    const { username, email, mobile, password } = await req.json();

    if (!username || !email || !mobile || !password) {
      return NextResponse.json(
        {
          message: "Username, email, mobile number and password are required",
        },
        { status: 400 }
      );
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        {
          message: "Please enter a valid 10-digit mobile number",
        },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    // Connect DB
    await connectDB();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
        { mobile },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username, email or mobile number already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      mobile,
      password: hashedPassword,
    });

    // Create JWT
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
      }
    );

    // Response
    const response = NextResponse.json(
      {
        message: "User registered successfully",
      },
      {
        status: 201,
      }
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
    console.error("REGISTER ERROR:", error);

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