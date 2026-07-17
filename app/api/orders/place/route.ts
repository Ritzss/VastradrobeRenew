/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/model/User";
import Order from "@/model/Order";
import Transaction from "@/model/Transaction";

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

    console.log("Incoming Products");
    console.log(JSON.stringify(products, null, 2));

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

    /* ---------------- ORDER ITEMS ---------------- */

    const orderItems = products.map((item: any) => ({
      productId: item.productId,

      name: item.name,

      sku: item.sku || "",

      color: item.color || "",

      size: item.size,

      quantity: item.qty,

      price: item.price,

      total: item.price * item.qty,

      image: Array.isArray(item.image)
        ? item.image
        : item.image
          ? [item.image]
          : [],
    }));

    console.log("ORDER ITEMS");
    console.log(JSON.stringify(orderItems, null, 2));

    /* ---------------- TOTAL ---------------- */

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.total,
      0,
    );

    const shippingCharge = subtotal >= 450 ? 0 : 150;

    const discount = 0;

    // GST @ 5%
    const tax = Number((subtotal * 0.05).toFixed(2));

    const totalAmount = subtotal + shippingCharge + tax - discount;

    const now = new Date();

    const random = Math.floor(1000 + Math.random() * 9000);

    const date =
      now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const orderNumber = `VDORD${date}${random}`;

    const invoiceNumber = `VDINV${date}${random}`;

    const transactionNumber = `VDTXN${date}${random}`;

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Order.create({
      userId: user._id,

      orderNumber,
      invoiceNumber,

      items: orderItems,

      subtotal,

      shippingCharge,

      discount,

      tax,

      totalAmount,

      deliveryAddress: {
        name: user.username,
        email: user.email,
        address,
        phone,
      },

      paymentMethod: "Razorpay",

      paymentStatus: "Paid",

      status: "paid",

      payment: {
        provider: "razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });

    /* ---------------- CREATE TRANSACTION ---------------- */
    const transaction = await Transaction.create({
      transactionNumber,

      orderId: order._id,
      userId: user._id,

      provider: "razorpay",

      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature:
        process.env.NODE_ENV !== "development"
          ? payment.razorpay_signature
          : "",

      subtotal,
      shippingCharge,
      discount,
      tax,
      totalAmount,

      paymentMethod: "Razorpay",

      status: "paid",

      invoiceNumber,
      invoiceUrl: `/api/orders/${order.orderNumber}/invoice`,

      currency: "INR",
    });
    order.transactionId = transaction._id;

    await order.save();

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
