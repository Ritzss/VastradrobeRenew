// app/api/auth/login-password/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  return NextResponse.json({ success: true });
}
