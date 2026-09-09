import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectDB();

    const user = await User.findById(decoded.id);

    const { productId, color, size } = await req.json();

    const index = user.savedForLater.findIndex(
      (item: any) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size,
    );

    if (index === -1) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const item = user.savedForLater[index];

    const existing = user.cart.find(
      (cartItem: any) =>
        cartItem.productId === item.productId &&
        cartItem.color === item.color &&
        cartItem.size === item.size,
    );

    if (existing) {
      existing.qty = Math.min(existing.qty + item.qty, 10);
    } else {
      user.cart.push(item);
    }

    user.savedForLater.splice(index, 1);

    await user.save();

    return NextResponse.json({
      success: true,
      cart: user.cart,
      savedForLater: user.savedForLater,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
