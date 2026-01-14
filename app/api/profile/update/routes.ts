import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { address, phone } = await req.json();

    if (!address || !phone) {
      return NextResponse.json(
        { message: "Address and phone required" },
        { status: 400 }
      );
    }

    await connectDB();

    await User.findByIdAndUpdate(decoded.id, {
      deliveryAddress: { address, phone },
    });

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
