"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const { registerForm, setRegisterForm, handleRegister } = useAppContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleRegister(e);
    if (success) router.replace(safeRedirect);
  };

  return (
    <div className="w-full flex justify-center px-6 py-16 h-full not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      <div className="w-full max-w-5xl rounded-4xl overflow-hidden shadow-[0_40px_100px_rgba(149,127,106,0.15)] md:flex">
        {/* LEFT PANEL */}
        <aside className="hidden md:w-[45%] bg-[#efe3d3] p-10 md:flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#5f5143]">
              Join VastraDrobe
            </h2>

            <p className="text-[#7a6a5c] leading-relaxed">
              Begin your journey into timeless silhouettes, conscious
              craftsmanship and everyday elegance.
            </p>
          </div>

          <div className="hidden md:block">
            <Image
              src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1771933083/authimg_unlbxi.png"
              width={400}
              height={250}
              alt="Register Visual"
              className="object-contain"
              priority
            />
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <aside className="h-full md:w-[55%] not-dark:bg-white p-10 flex flex-col justify-center">
          <form
            onSubmit={onSubmit}
            className="max-w-md w-full dark:text-[#5f5143] mx-auto space-y-6"
          >
            <input
              type="text"
              name="username"
              value={registerForm.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
            />

            <input
              type="email"
              name="email"
              value={registerForm.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border-b border-[#e6d8c8] p-2 outline-none focus:border-[#6a0f1f] transition"
            />

            <div className="flex border-b border-[#e6d8c8]">
              <input
                type={visible ? "text" : "password"}
                name="password"
                value={registerForm.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="flex-1 p-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="text-[#7a6a5c]"
              >
                {visible ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5f5143] text-white py-3 rounded-full hover:bg-[#6a0f1f] transition"
            >
              Create Account
            </button>

            <div className="text-center text-sm text-[#7a6a5c]">
              Already have an account?{" "}
              <Link href="login" className="underline hover:text-[#6a0f1f]">
                Login
              </Link>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
};

export default Register;
