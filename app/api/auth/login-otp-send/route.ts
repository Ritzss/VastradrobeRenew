import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json(
        {
          message: "Email or mobile number is required",
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

      // Prevent email enumeration
      if (!user) {
        return NextResponse.json({
          success: true,
        });
      }

      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const hashedOtp = await bcrypt.hash(otp, 10);

      user.loginOtp = hashedOtp;
      user.loginOtpExpiry = new Date(
        Date.now() + 10 * 60 * 1000
      );

      user.loginOtpAttempts = 0;

      await user.save();

      await sendOtpEmail(identifier, otp);

      return NextResponse.json({
        success: true,
      });
    }

    // ---------------- MOBILE OTP ----------------

    if (isMobile) {
      return NextResponse.json({
        success: true,
        provider: "msg91",
      });
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
    console.error("LOGIN OTP SEND:", error);

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