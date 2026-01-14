import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  const token = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const { cart } = await req.json();

  await connectDB();
  await User.findByIdAndUpdate(decoded.id, { cart });

  return NextResponse.json({ message: "Cart updated" });
}
