// app/api/test-mail/route.ts

import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mail";

export async function GET() {
  try {
    await sendOtpEmail("ritanshu@ads247365.com", "123456");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
