import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      // console.log("❌ Email missing");
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // console.log("📩 OTP request for:", email);

    await connectDB();

    const user = await User.findOne({ email });

    if(user){
      return NextResponse.json({ success: true });
    }

    if (!user) {
      // console.log("⚠️ User not found:", email);
      // still returning success to prevent enumeration
      return NextResponse.json({ success: false });
    }

    // console.log("✅ User found:", user.email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log("🔐 Generated OTP:", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    user.resetOtpAttempts = 0;
    user.resetVerified = false;

    await user.save();
    // console.log("💾 OTP saved to DB");

    try {
      await sendOtpEmail(email, otp);
      // console.log("📧 OTP email sent successfully");
    } catch (emailError) {
      // console.error("❌ Email send failed:", emailError);
      return NextResponse.json(
        { error: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    // console.error("🔥 Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
