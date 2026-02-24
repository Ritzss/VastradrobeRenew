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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!data.success) {
      toast.error("Invalid email address");
      setLoading(false);
      return; // 🚫 stops next step
    }

    setStep("otp");
    toast.success("OTP sent to your email.");
  } catch (err) {
    toast.error("Something went wrong");
  }

  setLoading(false);
};


  const verifyOtp = async (otpParam?: string) => {
    const otp = otpParam || otpDigits.join("");

    if (otp.length !== 6) return;

    setLoading(true);
    setMessage("");

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
    setMessage("");

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
    <div className="md:w-[80%] w-full m-20 overflow-hidden rounded-xl border md:h-[70vh] md:flex">

      {/* LEFT PANEL */}
      <aside className="md:w-[40%] h-auto bg-[#dfc9ac] shadow-[inset_0_0_20px_#cd0000] md:border-r-4 border-white flex-col flex justify-between">
        <header className="flex-col flex gap-5">
          <div className="font-sans text-[#cd0000] pt-6 text-4xl flex justify-center font-bold">
            Reset Password
          </div>
          <div className="text-[#cd0000] p-2.5 text-xl">
            Happens to the best of us.
            <br />
            Let’s get you back inside.
          </div>
        </header>

        <div className="overflow-hidden self-end">
          <Image
            src="/Assets/Images/authimg.png"
            width={300}
            height={200}
            alt="reset"
            className="w-83 h-50"
          />
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <aside className="md:w-[60%] bg-[#dfc9ac] h-auto font-sans shadow-[inset_0_0_150px_28px_#cd0000] text-white flex flex-col justify-center items-center">

        <div className="w-full max-w-lg  flex flex-col gap-4">

          {step === "email" && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-b outline-none p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={sendOtp}
                disabled={loading}
                className="bg-white text-[#cd0000] py-2 rounded mt-4 hover:bg-[#ffffff] transition"
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
                className="bg-white text-[#cd0000] py-2 rounded mt-4 hover:bg-[#ffffff] transition"
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
                className="bg-transparent border-b outline-none p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={resetPassword}
                disabled={loading}
                className="bg-white text-[#cd0000] py-2 rounded mt-4 hover:bg-[#ffffff] transition"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}

          {message && (
            <p className="text-sm text-center text-yellow-300 mt-2">
              {message}
            </p>
          )}

          <div className="text-center mt-4">
            Remember your password?{" "}
            <Link
              href="login"
              className="underline hover:text-[#ffffff]"
            >
              Back to Login
            </Link>
          </div>

        </div>

      </aside>
    </div>
  );
}
