/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import OtpInput from "./OtpInput";
import { toast } from "sonner";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 👑 LUXURY OVERHAUL: Centered Minimalist Log-In Card (Nangalia Ruchira Style)
 *
 * Elegant centered single-panel layout:
 * - Removed the bulky split aside panel completely for a clean, editorial look.
 * - 🔒 FIXED: Password input area is now 100% full width, matching all other inputs exactly!
 * - Fluid Transitions: Implemented AnimatePresence to slide & fade forms dynamically.
 */
const Login = () => {
  const { loginForm, setLoginForm, handleLogin, loadUser } = useAppContext();
  const [visible, setVisible] = useState(false);
  const [useOtp, setUseOtp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    const success = await handleLogin(e);
    if (success) router.replace(safeRedirect);
  };

  const sendOtp = async () => {
    if (!isEmail && !isMobile) {
      return toast.error("Enter a valid email or mobile number");
    }

    setLoading(true);

    // EMAIL OTP
    if (isEmail) {
      const res = await fetch("/api/auth/login-otp-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
        }),
      });

      setLoading(false);

      if (!res.ok) {
        return toast.error("Unable to send OTP");
      }

      toast.success("OTP sent to your email");
      setOtpSent(true);

      return;
    }

    if (!sdkLoaded) {
      setLoading(false);
      return toast.error("OTP service is still loading. Please try again.");
    }

    initMsg91();

    if (typeof window.sendOtp !== "function") {
      setLoading(false);
      return toast.error("MSG91 SDK not initialized.");
    }

    // MOBILE OTP (MSG91)
    window.sendOtp(
      `91${identifier}`,
      () => {
        setLoading(false);
        setOtpSent(true);
        toast.success("OTP sent to your mobile");
      },
      (err) => {
        console.error(err);
        setLoading(false);
        toast.error(err?.message || "Unable to send OTP");
      },
    );
  };

  const verifyOtp = async (otpParam?: string) => {
    const otp = otpParam || otpDigits.join("");

    if (otp.length !== 6) return;

    setLoading(true);

    // EMAIL OTP
    if (isEmail) {
      const res = await fetch("/api/auth/login-otp-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          otp,
        }),
      });

      setLoading(false);

      if (res.ok) {
        toast.success("OTP Verified");
        await loadUser();
        router.replace(safeRedirect);
      } else {
        toast.error("Invalid OTP");
      }

      return;
    }

    // MOBILE OTP
    window.verifyOtp(
      otp,
      async (data) => {
        if (data.type !== "success") {
          setLoading(false);
          return toast.error("OTP verification failed");
        }

        const accessToken =
          data.message ??
          data["access-token"] ??
          data.accessToken ??
          data.token;

        if (!accessToken) {
          setLoading(false);
          return toast.error("MSG91 did not return an access token.");
        }

        const res = await fetch("/api/auth/msg91-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            token: accessToken,
          }),
        });

        setLoading(false);
        const result = await res.json();

        if (!res.ok) {
          console.error(result);
          return toast.error(result.message || "Login failed");
        }

        toast.success("Logged in successfully");
        await loadUser();
        router.replace(safeRedirect);
      },
      (err) => {
        console.error("MSG91 Verify Error:", err);
        setLoading(false);
        toast.error(err?.message || "Invalid OTP");
      },
    );
  };

  const toggleMode = () => {
    setUseOtp((prev) => !prev);
    setOtpDigits(Array(6).fill(""));
    setOtpSent(false);

    setLoginForm((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const identifier = loginForm.identifier.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const isMobile = /^[6-9]\d{9}$/.test(identifier);

  const initMsg91 = () => {
    if (sdkInitialized) return;

    if (typeof window.initSendOTP !== "function") {
      console.error("MSG91 initSendOTP not available");
      return;
    }

    window.initSendOTP({
      widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID!,
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN!,
      exposeMethods: true,
      success: (data: any) => {
        console.log("MSG91 Success:", data);
      },
      failure: (err: any) => {
        console.error("MSG91 Failure:", err);
      },
    });

    setSdkInitialized(true);
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
            Sign In
          </h1>
        </div>

        {/* Form area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {useOtp ? (
              !otpSent ? (
                /* STEP 1: OTP Email/Mobile request */
                <motion.div
                  key="otp-request"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <input
                    type="text"
                    name="identifier"
                    value={loginForm.identifier}
                    onChange={handleInputChange}
                    placeholder="Email Address or Mobile Number"
                    autoComplete="username"
                    className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                  />

                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
                  >
                    {loading ? "Sending OTP..." : "Get Access Code"}
                  </button>
                </motion.div>
              ) : (
                /* STEP 2: OTP Verification input */
                <motion.div
                  key="otp-verify"
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
                      We&apos;ve sent a 6-digit access code to
                    </p>
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 break-all">
                      {identifier}
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
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>

                  <div className="text-[10px] text-neutral-400 tracking-wider">
                    Didn&apos;t receive the code?
                    <button
                      onClick={sendOtp}
                      className="ml-1 font-bold text-[#6A0F1F] dark:text-[#e4e198] hover:underline uppercase"
                    >
                      Resend
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpDigits(Array(6).fill(""));
                    }}
                    className="text-[10px] font-bold text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] uppercase tracking-widest block mx-auto transition"
                  >
                    ← Change Email / Mobile
                  </button>
                </motion.div>
              )
            ) : (
              /* STEP 3: Password Login form */
              <motion.div
                key="password-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <input
                  type="text"
                  name="identifier"
                  value={loginForm.identifier}
                  onChange={handleInputChange}
                  placeholder="Email Address or Mobile Number"
                  autoComplete="username"
                  className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
                />

                {/* 🔒 FIXED: Password container uses relative + absolute Eye placement, forcing input to be 100% full-width */}
                <div className="relative w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 flex items-center justify-between focus-within:border-[#6A0F1F] dark:focus-within:border-[#e4e198] transition shadow-xs">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full bg-transparent text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-4 text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition cursor-pointer"
                  >
                    {visible ? (
                      <EyeIcon size={16} />
                    ) : (
                      <EyeClosedIcon size={16} />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <Link
                    href="reset_password"
                    className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  onClick={handlePasswordLogin}
                  className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
                >
                  Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOGGLE OPTIONS */}
          <div className="flex flex-col items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
            <button
              onClick={toggleMode}
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition cursor-pointer"
            >
              {useOtp
                ? "Sign in with Account Password"
                : "Sign in with Dynamic Access OTP"}
            </button>

            <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
              New to the universe?{" "}
              <Link
                href="register"
                className="underline text-[#6A0F1F] dark:text-[#e4e198] hover:text-neutral-900 dark:hover:text-white font-bold transition ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("MSG91 Loaded");
          setSdkLoaded(true);
          initMsg91();
        }}
      />
    </div>
  );
};

export default Login;
