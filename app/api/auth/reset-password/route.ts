import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // 🔐 Critical security check
    if (!user.resetVerified) {
      return NextResponse.json(
        { error: "Unauthorized reset attempt" },
        { status: 403 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    user.password = hashed;

    // Clear all reset data
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.resetOtpAttempts = 0;
    user.resetVerified = false;

    await user.save();

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
