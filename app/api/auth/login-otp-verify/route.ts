// app/api/auth/login-otp-verify/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });

  if (!user.loginOtp || new Date() > user.loginOtpExpiry)
    return NextResponse.json({ error: "OTP expired" }, { status: 401 });

  if (user.loginOtpAttempts >= 5)
    return NextResponse.json({ error: "Too many attempts" }, { status: 403 });

  const valid = await bcrypt.compare(otp, user.loginOtp);

  if (!valid) {
    user.loginOtpAttempts += 1;
    await user.save();
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  // Clear OTP
  user.loginOtp = undefined;
  user.loginOtpExpiry = undefined;
  user.loginOtpAttempts = 0;
  await user.save();

  return NextResponse.json({ success: true });
}
