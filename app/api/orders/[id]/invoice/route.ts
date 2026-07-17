import { connectDB } from "@/lib/db";
import Order from "@/model/Order";
import { generateInvoice } from "@/lib/invoice/generate";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const order = await Order.findById(id).populate("transactionId");

    if (!order) {
      return new Response("Order not found", {
        status: 404,
      });
    }

    const pdf = await generateInvoice(order);
    // console.log("PDF Length:", pdf.length);

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
