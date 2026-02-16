import Postmark from "postmark";

const client = new Postmark.ServerClient(
  process.env.POSTMARK_API_TOKEN!
);

export async function sendOtpEmail(email: string, otp: string) {
  await client.sendEmail({
    From: "support@vastradrobe.com",
    To: email,
    Subject: "Password Reset OTP",
    TextBody: `Your OTP is ${otp}. It expires in 15 minutes.`,
  });
}
