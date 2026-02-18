import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    if (!user.resetOtp || !user.resetOtpExpiry)
      return NextResponse.json({ error: "No OTP found" }, { status: 400 });

    if (new Date() > user.resetOtpExpiry)
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });

    if (user.resetOtpAttempts >= 5)
      return NextResponse.json(
        { error: "Too many attempts" },
        { status: 403 }
      );

    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid) {
      user.resetOtpAttempts += 1;
      await user.save();
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark verified
    user.resetVerified = true;
    await user.save();

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
