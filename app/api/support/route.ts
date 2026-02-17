import { NextResponse } from "next/server";
// import { sendOtpEmail } from "@/lib/mail"; // reuse Postmark client
import Postmark from "postmark";

const client = new Postmark.ServerClient(
  process.env.POSTMARK_API_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await client.sendEmail({
      From: "support@vastradrobe.com",
      To: "support@vastradrobe.com",
      ReplyTo: email,
      Subject: `Support: ${subject}`,
      TextBody: `
        New Support Message

        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
