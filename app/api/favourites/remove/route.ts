import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie
    ?.split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({}, { status: 401 });

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const { collection, productId } = await req.json();

  await connectDB();

  await User.updateOne(
    { _id: decoded.id },
    {
      $pull: {
        [`favorites.${collection}`]: productId,
      },
    }
  );

  return NextResponse.json({ success: true });
}
