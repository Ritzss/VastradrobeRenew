import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ cart: [] }, { status: 401 });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    await connectDB();

    const user = await User.findById(decoded.id).lean();

    return NextResponse.json({
      cart: user?.cart || [],
    });
  } catch {
    return NextResponse.json({ cart: [] }, { status: 401 });
  }
}
