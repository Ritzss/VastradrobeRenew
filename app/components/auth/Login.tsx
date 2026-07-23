/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import { toast } from "sonner";
import Script from "next/script";

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
        console.log("MSG91 Verify Response:", data);
        console.log("MSG91 Verify Response:", JSON.stringify(data, null, 2));
        console.dir(data);

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

  // useEffect(() => {
  // const timer = setInterval(() => {
  //   if (window.initSendOTP) {
  //     clearInterval(timer);

  //     window.initSendOTP({
  //       widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID!,
  //       tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN!,
  //       exposeMethods: true,
  //     });
  //   }
  // }, 300);

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
    <div className="w-full h-full flex justify-center px-6 py-16 not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      <div className="w-full h-full max-w-5xl rounded-4xl overflow-hidden shadow-[0_40px_100px_rgba(149,127,106,0.15)] md:flex">
        {/* LEFT PANEL */}
        <aside className="hidden md:w-[45%] bg-[#efe3d3] p-10 md:flex flex-col justify-between h-full">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#5f5143]">
              Welcome Back
            </h2>

            <p className="text-[#7a6a5c] leading-relaxed">
              Access your wardrobe universe. Experience comfort, quality and
              timeless silhouettes crafted for everyday elegance.
            </p>
          </div>

          <div className="hidden md:block">
            <Image
              src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1771933083/authimg_unlbxi.png"
              width={400}
              height={250}
              alt="Fashion Visual"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <aside className="md:w-[55%] h-full dark:text-[#5f5143] not-dark:bg-white p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <input
              type="text"
              name="identifier"
              value={loginForm.identifier}
              onChange={handleInputChange}
              disabled={otpSent}
              placeholder="Email Address or Mobile Number"
              autoComplete="username"
              className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
            />

            {!useOtp && (
              <>
                <div className="flex border-b border-[#e6d8c8]">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="flex-1 p-2 outline-none 5f5143"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="text-[#7a6a5c]"
                  >
                    {visible ? (
                      <EyeIcon size={18} />
                    ) : (
                      <EyeClosedIcon size={18} />
                    )}
                  </button>
                </div>

                <div className="text-right text-sm">
                  <Link
                    href="reset_password"
                    className="text-[#7a6a5c] hover:text-[#6a0f1f]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  onClick={handlePasswordLogin}
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  Login
                </button>
              </>
            )}

            {useOtp && !otpSent && (
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            )}

            {useOtp && otpSent && (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-[#5f5143]">
                    Verify OTP
                  </h3>

                  <p className="text-sm text-[#7a6a5c]">
                    We&apos;ve sent a 6-digit OTP to
                  </p>

                  <p className="font-medium break-all">{identifier}</p>
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
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center text-sm">
                  Didn&apos;t receive the OTP?
                  <button
                    onClick={sendOtp}
                    className="ml-1 font-medium text-[#6a0f1f] hover:underline"
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
                  className="w-full text-sm text-[#7a6a5c] hover:text-[#6a0f1f]"
                >
                  ← Change Email / Mobile
                </button>
              </>
            )}

            <button
              onClick={toggleMode}
              className="text-sm text-[#7a6a5c] hover:text-[#6a0f1f] transition text-center"
            >
              {useOtp
                ? "Login with Password Instead"
                : "Login with OTP Instead"}
            </button>

            <div className="text-center text-sm text-[#7a6a5c]">
              New here?{" "}
              <Link href="register" className="underline hover:text-[#6a0f1f]">
                Create Account
              </Link>
            </div>
          </div>
        </aside>
      </div>
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
