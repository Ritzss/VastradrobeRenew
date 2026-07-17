import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json(
        {
          message: "Identifier and OTP are required",
        },
        {
          status: 400,
        }
      );
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isMobile = /^[6-9]\d{9}$/.test(identifier);

    await connectDB();

    // ---------------- EMAIL OTP ----------------

    if (isEmail) {
      const user = await User.findOne({
        email: identifier.toLowerCase(),
      });

      if (!user) {
        return NextResponse.json(
          {
            message: "Invalid OTP",
          },
          {
            status: 401,
          }
        );
      }

      if (!user.loginOtp || new Date() > user.loginOtpExpiry) {
        return NextResponse.json(
          {
            message: "OTP expired",
          },
          {
            status: 401,
          }
        );
      }

      if (user.loginOtpAttempts >= 5) {
        return NextResponse.json(
          {
            message: "Too many attempts",
          },
          {
            status: 403,
          }
        );
      }

      const valid = await bcrypt.compare(otp, user.loginOtp);

      if (!valid) {
        user.loginOtpAttempts += 1;
        await user.save();

        return NextResponse.json(
          {
            message: "Invalid OTP",
          },
          {
            status: 401,
          }
        );
      }

      // Clear OTP
      user.loginOtp = undefined;
      user.loginOtpExpiry = undefined;
      user.loginOtpAttempts = 0;

      await user.save();

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

      const response = NextResponse.json(
        {
          message: "Login successful",
        },
        {
          status: 200,
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
    }

    // ---------------- MOBILE OTP ----------------

    if (isMobile) {
      return NextResponse.json(
        {
          provider: "msg91",
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Invalid email or mobile number",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error("LOGIN OTP VERIFY:", error);

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