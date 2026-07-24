import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import { sendOtpEmail } from "@/lib/mail";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 🔒 RATE LIMIT: Max 3 OTP requests per minute per IP to prevent spam and billing exhaustion
    const isAllowed = rateLimit(ip, 3, 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Too many OTP requests. Please wait 60 seconds before trying again.",
        },
        { status: 429 }, // Too Many Requests
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    // If user is found, generate and send the password-reset OTP
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedOtp = await bcrypt.hash(otp, 10);

      user.resetOtp = hashedOtp;
      user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
      user.resetOtpAttempts = 0;
      user.resetVerified = false;

      await user.save();

      try {
        await sendOtpEmail(email, otp);
      } catch (emailError) {
        console.error("Postmark Reset OTP Email Send Failure:", emailError);
        return NextResponse.json(
          { error: "Failed to send OTP email" },
          { status: 500 },
        );
      }
    }

    // Always return success: true to prevent Email/User enumeration attacks
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PASSWORD RESET OTP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
