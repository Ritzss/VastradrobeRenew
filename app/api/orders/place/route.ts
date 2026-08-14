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
    await connectDB();

    let user = null;

    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        user = await User.findById(decoded.id);
      } catch {
        user = null;
      }
    }

    /* ---------------- BODY ---------------- */
    const {
      name,
      address,
      phone,
      products,
      payment,
      paymentMethod,
      shippingCharge,
    } = await req.json();

    // console.log("Incoming Products");
    // console.log(JSON.stringify(products, null, 2));

    if (!address || !phone || !products?.length) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 },
      );
    }

    // console.log(JSON.stringify(products, null, 2));

    if (paymentMethod !== "COD" && !payment) {
      return NextResponse.json(
        { message: "Payment data missing" },
        { status: 400 },
      );
    }

    /* ---------------- DB ---------------- */
    // await connectDB();

    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return NextResponse.json({ message: "User not found" }, { status: 404 });
    // }

    /* ---------------- PAYMENT VERIFY ---------------- */
    let razorpay_order_id = null;
    let razorpay_payment_id = null;

    if (paymentMethod !== "COD") {
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
    }

    /* ---------------- ORDER ITEMS ---------------- */

    // Convert the checkout/cart products into the structure
    // stored permanently inside the order.
    //
    // IMPORTANT:
    // `design` must be preserved here because the product can have
    // multiple designs under the same color variant. This allows
    // the review system to later identify the exact purchased
    // variant.
    const orderItems = products.map((item: any) => ({
      productId: item.productId,

      name: item.name,

      sku: item.sku || "",

      // Selected color variant.
      color: item.color || "",

      // Selected design inside the color variant.
      design: item.design || "",

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

    // console.log("ORDER ITEMS");
    // console.log(JSON.stringify(orderItems, null, 2));

    /* ---------------- TOTAL ---------------- */

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.total,
      0,
    );

    const finalShipping =
      typeof shippingCharge === "number"
        ? shippingCharge
        : subtotal >= 450
          ? 0
          : 150;

    const discount = 0;

    // GST @ 5%
    const tax = Number((subtotal * 0.05).toFixed(2));

    const totalAmount = subtotal + finalShipping + tax - discount;

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
      userId: user?._id || null,

      orderNumber,
      invoiceNumber,

      items: orderItems,

      subtotal,

      shippingCharge: finalShipping,

      discount,

      tax,

      totalAmount,

      deliveryAddress: {
        name: name || user?.username || "",
        email: user?.email || "",
        address,
        phone,
      },

      paymentMethod: paymentMethod === "COD" ? "COD" : "Razorpay",

      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",

      status: paymentMethod === "COD" ? "pending" : "paid",

      payment: {
        provider: paymentMethod === "COD" ? "COD" : "razorpay",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });

    /* ---------------- CREATE TRANSACTION ---------------- */

    let transaction = null;

    if (paymentMethod !== "COD") {
      transaction = await Transaction.create({
        transactionNumber,

        orderId: order._id,
        userId: user?._id || null,

        provider: "razorpay",

        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature:
          process.env.NODE_ENV !== "development"
            ? payment.razorpay_signature
            : "",

        subtotal,
        shippingCharge: finalShipping,
        discount,
        tax,
        totalAmount,

        paymentMethod: "Razorpay",

        status: "paid",

        invoiceNumber,
        invoiceUrl: `/api/orders/${order.orderNumber}/invoice`,

        currency: "INR",
      });
    }

    order.transactionId = transaction?._id || null;

    await order.save();

    /* ---------------- SAVE USER ---------------- */
    if (user) {
      user.deliveryAddress = { address, phone };
      user.cart = [];
      await user.save();
    }

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
