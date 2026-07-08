"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import OtpInput from "./OtpInput";
import { toast } from "sonner";

const Login = () => {
  const { loginForm, setLoginForm, handleLogin, loadUser } = useAppContext();
  const [visible, setVisible] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));

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
    if (!loginForm.email) return toast.error("Email Required");

    setLoading(true);
    await fetch("/api/auth/login-otp-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginForm.email }),
    });
    setLoading(false);
  };

  const verifyOtp = async (otpParam?: string) => {
    const otp = otpParam || otpDigits.join("");
    if (otp.length !== 6) return;

    setLoading(true);
    const res = await fetch("/api/auth/login-otp-verify", {
      method: "POST",
      body: JSON.stringify({ email: loginForm.email, otp }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Otp Validated");
      await loadUser();
      router.replace(safeRedirect);
    } else {
      toast.error("Otp is Invalid");
    }
  };

  const toggleMode = () => {
    setUseOtp((prev) => !prev);
    setOtpDigits(Array(6).fill(""));
    setLoginForm((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div className="w-full h-full flex justify-center px-6 py-16 light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
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
              priority
            />
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <aside className="md:w-[55%] h-full dark:text-[#5f5143] light:bg-white p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleInputChange}
              placeholder="Email"
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

            {useOtp && (
              <>
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

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
                  {loading ? "Verifying..." : "Login with OTP"}
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
    </div>
  );
};

export default Login;
