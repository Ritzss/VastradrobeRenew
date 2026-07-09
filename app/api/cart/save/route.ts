import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    await connectDB();

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false },
        { status: 404 }
      );
    }

    if (user.savedForLater.length >= 10) {
  return NextResponse.json(
    {
      success: false,
      message: "You can save a maximum of 10 products for later.",
    },
    { status: 400 }
  );
}

    const { productId, color, size } = await req.json();

    const index = user.cart.findIndex(
      (item: any) =>
        item.productId === productId &&
        item.color === color &&
        item.size === size
    );

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
        },
        { status: 404 }
      );
    }

    const item = user.cart[index];

    user.savedForLater.push(item);

    user.cart.splice(index, 1);

    await user.save();

    return NextResponse.json({
      success: true,
      cart: user.cart,
      savedForLater: user.savedForLater,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}