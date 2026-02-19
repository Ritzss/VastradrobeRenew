import Postmark from "postmark";

const client = new Postmark.ServerClient(
  process.env.POSTMARK_API_TOKEN!
);

export async function sendOtpEmail(email: string, otp: string) {
  await client.sendEmail({
    From: "support@vastradrobe.com",
    To: email,
    Subject: "Your VastraDrobe Verification Code",
    TextBody: `Your VastraDrobe verification code is: ${otp} This code will expire in 15 minutes. If you did not request this code, please ignore this email.`,
    HtmlBody: `
      <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:24px; border-radius:8px;">
          <h2 style="margin-top:0;">VastraDrobe Verification Code</h2>
          
          <p>Use the following OTP to complete your login:</p>
          
          <div style="font-size:28px; font-weight:bold; letter-spacing:6px; background:#f2f2f2; padding:14px; text-align:center; border-radius:6px; margin:20px 0;">
            ${otp}
          </div>

          <p style="margin:0;">
            This code will expire in <strong>15 minutes</strong>.
          </p>

          <p style="margin-top:20px; font-size:12px; color:#777;">
            If you did not request this verification code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
