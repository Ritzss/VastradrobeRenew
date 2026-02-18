// app/api/auth/login-otp-verify/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
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

  // 🔥 Create JWT
const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    username: user.username,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

const response = NextResponse.json(
  { message: "Login successful" },
  { status: 200 }
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
