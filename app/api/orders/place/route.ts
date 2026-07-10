/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";

export async function POST(req: Request) {
  try {
    /* ---------------- AUTH ---------------- */
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    /* ---------------- BODY ---------------- */
    const { address, phone, products, payment } = await req.json();

    if (!address || !phone || !products?.length) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 },
      );
    }

    // console.log(JSON.stringify(products, null, 2));

    if (!payment) {
      return NextResponse.json(
        { message: "Payment data missing" },
        { status: 400 },
      );
    }

    /* ---------------- DB ---------------- */
    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /* ---------------- PAYMENT VERIFY ---------------- */
    let razorpay_order_id = null;
    let razorpay_payment_id = null;

    if (process.env.NODE_ENV !== "development") {
      const {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature,
      } = payment;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { message: "Invalid payment signature" },
          { status: 400 },
        );
      }

      razorpay_order_id = orderId;
      razorpay_payment_id = paymentId;
    } else {
      razorpay_order_id = `dev_order_${Date.now()}`;
      razorpay_payment_id = `dev_payment_${Date.now()}`;
    }

    /* ---------------- TOTAL ---------------- */
    const subtotal = products.reduce(
      (sum: number, p: any) => sum + p.price * p.qty,
      0,
    );

    const shipping = subtotal >= 450 ? 0 : 150;

    const totalAmount = subtotal + shipping;

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Order.create({
      userId: user._id,
      items: products,
      deliveryAddress: { address, phone },
      totalAmount,
      status: "paid",
      payment: {
        provider: "razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });

    /* ---------------- SAVE USER ---------------- */
    user.deliveryAddress = { address, phone };
    user.cart = [];
    await user.save();

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId: order._id,
        totalAmount,
        products,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
