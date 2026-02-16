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
  const { loginForm, setLoginForm, handleLogin } = useAppContext();
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
    if (!loginForm.email) return;

    setLoading(true);
    await fetch("/api/auth/login-otp-send", {
      method: "POST",
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
      toast.success("Otp Validated")
      router.replace(safeRedirect);
    }
    else{
      toast.error("Otp is Invalid")
    }
  };

  const toggleMode = () => {
    setUseOtp((prev) => !prev);
    setOtpDigits(Array(6).fill(""));
    setLoginForm((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div className="md:w-[80%] text-white m-2 overflow-hidden rounded-xl border md:h-[70vh] md:flex">

      {/* LEFT PANEL */}
      <aside className="md:w-[40%] h-110 md:h-auto bg-[#DFC9AC] shadow-[inset_0_0_20px_#cd0000] md:border-r-4 flex-col flex justify-between">
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
            src={"/Assets/Images/authimg.png"}
            width={300}
            height={200}
            alt=""
            className="w-83 h-50"
          />
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <aside className="md:w-[60%] h-110 md:h-auto font-sans bg-[#cd0000] shadow-[inset_0_0_20px_#DFC9AC] flex flex-col justify-center items-center p-8">

        <div className="w-full max-w-sm flex flex-col gap-4">

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

              <button
                onClick={handlePasswordLogin}
                className="bg-white text-[#cd0000] py-2 rounded mt-4 hover:bg-[#DFC9AC] transition"
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
                className="bg-white text-[#cd0000] py-2 rounded mt-2"
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
                className="bg-white text-[#cd0000] py-2 rounded mt-4"
              >
                {loading ? "Verifying..." : "Login with OTP"}
              </button>
            </>
          )}

          <div
            onClick={toggleMode}
            className="text-center underline cursor-pointer mt-4 hover:text-[#DFC9AC]"
          >
            {useOtp ? "Login with Password Instead" : "Login with OTP Instead"}
          </div>

          <div className="text-center mt-4 flex flex-col gap-2">
            <Link
              href="reset_password"
              className="underline hover:text-[#DFC9AC]"
            >
              Forgot Password
            </Link>

            <div>
              New here?{" "}
              <Link
                href="register"
                className="underline hover:text-[#DFC9AC]"
              >
                Create Account
              </Link>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default Login;
