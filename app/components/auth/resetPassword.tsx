"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OtpInput from "./OtpInput";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 👑 LUXURY OVERHAUL: Centered Minimalist Reset Password Card (Nangalia Ruchira Style)
 *
 * Elegant centered single-panel layout:
 * - Removed the bulky split aside panel completely for a clean, editorial look.
 * - Fluid Step Transitions: Implemented AnimatePresence to slide & fade forms smoothly.
 */
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
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 bg-[#fcfbfa] dark:bg-black transition-colors duration-300">
      {/* Cinematic Overhauled Centered Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)] dark:shadow-none select-none"
      >
        {/* Header Branding */}
        <div className="text-center pb-6 mb-6 border-b border-neutral-100 dark:border-neutral-900">
          <p className="text-[10px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.35em] uppercase">
            Secure Portal
          </p>
          <h1 className="font-serif text-3xl font-light text-neutral-800 dark:text-white uppercase tracking-wide mt-2">
            Recovery
          </h1>
        </div>

        {/* Form content steps */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === "email" && (
              /* STEP 1: Enter Email */
              <motion.div
                key="recovery-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
                >
                  {loading ? "Sending..." : "Send Access OTP"}
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              /* STEP 2: Verify OTP */
              <motion.div
                key="recovery-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
                    Verify Code
                  </h3>
                  <p className="text-[10px] text-neutral-400 tracking-wider">
                    Enter the 6-digit OTP sent to
                  </p>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 break-all">
                    {email}
                  </p>
                </div>

                <OtpInput
                  value={otpDigits}
                  setValue={setOtpDigits}
                  length={6}
                  onComplete={(otp) => verifyOtp(otp)}
                />

                <button
                  onClick={() => verifyOtp()}
                  disabled={loading}
                  className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </motion.div>
            )}

            {step === "password" && (
              /* STEP 3: Enter New Password */
              <motion.div
                key="recovery-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <p className="text-xs text-center font-semibold uppercase tracking-wider text-red-600 animate-fadeIn">
              {message}
            </p>
          )}

          <div className="text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400 pt-4 border-t border-neutral-100 dark:border-neutral-900">
            Remember your password?{" "}
            <Link
              href="login"
              className="underline text-[#6A0F1F] dark:text-[#e4e198] hover:text-neutral-900 dark:hover:text-white font-bold transition ml-1"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
