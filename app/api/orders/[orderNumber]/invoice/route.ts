/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Order from "@/model/Order";
import { generateInvoice } from "@/lib/invoice/generate";
import Transaction from "@/model/Transaction";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    await connectDB();

    // ---------------- AUTH ----------------
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return new Response("Invalid token", {
        status: 401,
      });
    }

    // ---------------- ORDER ----------------
    const { orderNumber } = await params;

    const order = await Order.findOne({
      orderNumber,
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    const transaction = await Transaction.findById(order.transactionId);

    // ---------------- OWNER CHECK ----------------

    // console.log("Decoded Token:", decoded);
    // console.log("Order User:", order.userId.toString());
    // console.log("Token User:", decoded.id);
    // console.log("Order Number:", order.orderNumber);

    if (order.userId.toString() !== decoded.id) {
      return new Response("Forbidden", {
        status: 403,
      });
    }

    // ---------------- PDF ----------------
    // const pdf = await generateInvoice(order);
    const pdf = await generateInvoice(order, transaction);

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Invoice Error:", err);

    return new Response("Invoice generation failed", {
      status: 500,
    });
  }
}
