import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";

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

    const { address, phone, products } = await req.json();

    if (!address || !phone || !products?.length) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const totalAmount = products.reduce(
      (sum: number, p: any) => sum + p.price * p.qty,
      0
    );

    // ✅ CREATE ORDER
    const order = await Order.create({
      userId: user._id,
      items: products,
      deliveryAddress: {
        address,
        phone,
      },
      totalAmount,
      status: "placed", // lowercase ✅
    });

    // ✅ SAVE DELIVERY ADDRESS
    user.deliveryAddress = { address, phone };
    user.cart = [];
    await user.save();

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId: order._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
