// app/api/auth/login-otp-send/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  const { email } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ success: true });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  user.loginOtp = hashedOtp;
  user.loginOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  user.loginOtpAttempts = 0;

  await user.save();

  await sendOtpEmail(email, otp);

  return NextResponse.json({ success: true });
}
