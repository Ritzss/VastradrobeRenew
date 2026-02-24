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
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      headers: {
        "Content-Type": "application/json",
      },
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
      body: JSON.stringify({
        email: loginForm.email,
        otp,
      }),
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
    <div className="md:w-[80%] w-full text-black border-white mt-4 md:m-20 overflow-hidden rounded-xl border md:h-[70vh] md:flex">
      {/* LEFT PANEL */}
      <aside className="md:w-[40%] h-auto bg-[#DFC9AC] shadow-[inset_0_0_20px_#cd0000] md:border-r-4 border-white flex-col flex justify-between">
        <header className="flex-col flex gap-5">
          <div className="font-sans text-[#cd0000] pt-6 text-4xl flex justify-center font-bold">
            Login
          </div>
          <div className="text-[#cd0000] p-2.5 text-xl">
            Access your wardrobe universe.
          </div>
        </header>
        <div className="overflow-hidden self-end">
          <Image
            src={"https://res.cloudinary.com/dwhn5ec09/image/upload/v1771933083/authimg_unlbxi.png"}
            width={300}
            height={200}
            alt=""
            className="w-83 h-50"
          />
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <aside className="md:w-[60%] h-auto bg-[#DFC9AC] font-sans shadow-[inset_0_0_150px_28px_#cd0000] flex flex-col justify-center items-center p-8">
        <div className="w-full text-white max-w-lg flex flex-col gap-4">
          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="bg-transparent border-b outline-none p-2"
          />

          {!useOtp && (
            <>
              {/* PASSWORD */}
              <div className="flex border-b">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="bg-transparent outline-none flex-1 p-2"
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeIcon /> : <EyeClosedIcon />}
                </div>
              </div>

              <div className="w-full flex justify-between items-center">
                <button
                  onClick={handlePasswordLogin}
                  className="bg-white cursor-pointer text-[#cd0000] py-2 hover:text-white rounded mt-4 lg:w-[60%] w-full hover:bg-[#6a0f1f] transition"
                >
                  Login
                </button>
                <Link
                  href="reset_password"
                  className="hidden lg:block text-[#cd0000] bg-white cursor-pointer  py-2 rounded mt-4 px-1 hover:text-white hover:bg-[#6a0f1f] transition"
                >
                  Forgot Password
                </Link>
              </div>
            </>
          )}

          {useOtp && (
            <>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="bg-white  hover:text-white hover:bg-[#6a0f1f] text-[#cd0000] py-2 rounded mt-2"
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
                className="bg-white  hover:text-white hover:bg-[#6a0f1f] text-[#cd0000] py-2 rounded mt-4"
              >
                {loading ? "Verifying..." : "Login with OTP"}
              </button>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Link
              href="reset_password"
              className="block lg:hidden underline lg:w-[33%] hover:text-[#DFC9AC]"
            >
              Forgot Password
            </Link>

            <div className=" mt-15 w-[80%] lg:w-[60%] mx-auto text-[#6a0f1f] py-2 rounded transition text-center cursor-pointer">
              New here?{" "}
              <Link href="register" className="hover:text-[#cd0000] underline">
                Create Account
              </Link>
            </div>

            <button
              onClick={toggleMode}
              className="bg-white  hover:bg-[#6a0f1f] text-[#cd0000] hover:text-white py-3 rounded mt-4  transition text-center cursor-pointer"
            >
              {useOtp
                ? "Login with Password Instead"
                : "Login with OTP Instead"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Login;
