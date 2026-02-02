/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectDB();

    const user = await User.findById(decoded.id).select(
      "email username deliveryAddress"
    );

    if (!user) {
      throw new Error("User not found");
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          deliveryAddress: user.deliveryAddress || null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    // 🔥 delete expired / invalid JWT
    const response = NextResponse.json(
      { user: null },
      { status: 401 }
    );

    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    return response;
  }
}
