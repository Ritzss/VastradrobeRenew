"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    if (!email) return toast.error("Enter Email First");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Invalid email address");
        setLoading(false);
        return;
      }

      setStep("otp");
      toast.success("OTP sent to your email.");
    } catch {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const verifyOtp = async (otpParam?: string) => {
    const otp = otpParam || otpDigits.join("");
    if (otp.length !== 6) return;

    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    setLoading(false);

    if (res.ok) {
      setStep("password");
      setMessage("");
    } else {
      const data = await res.json();
      setMessage(data.error || "Invalid OTP");
    }
  };

  const resetPassword = async () => {
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("Password updated successfully!");
      setTimeout(() => router.push("login"), 1500);
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to reset password");
    }
  };

  return (
    <div className="w-full flex justify-center px-6 py-16 bg-[#f9f5ef] h-full">
      <div className="w-full max-w-5xl rounded-4xl overflow-hidden shadow-[0_40px_100px_rgba(149,127,106,0.15)] md:flex">
        {/* LEFT PANEL */}
        <aside className="md:w-[45%] bg-[#efe3d3] p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#5f5143]">
              Reset Password
            </h2>
            <p className="text-[#7a6a5c] leading-relaxed">
              Happens to the best of us. Let’s get you back inside.
            </p>
          </div>

          <div className="hidden md:block">
            <Image
              src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1771933083/authimg_unlbxi.png"
              width={400}
              height={250}
              alt="Reset Visual"
              className="object-contain"
              priority
            />
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <aside className="md:w-[55%] bg-white p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            {step === "email" && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <OtpInput
                  value={otpDigits}
                  setValue={setOtpDigits}
                  length={6}
                  onComplete={(otp) => verifyOtp(otp)}
                />

                <button
                  onClick={() => verifyOtp()}
                  disabled={loading}
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </>
            )}

            {message && (
              <p className="text-sm text-center text-[#6a0f1f]">{message}</p>
            )}

            <div className="text-center text-sm text-[#7a6a5c]">
              Remember your password?{" "}
              <Link href="login" className="underline hover:text-[#6a0f1f]">
                Back to Login
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
