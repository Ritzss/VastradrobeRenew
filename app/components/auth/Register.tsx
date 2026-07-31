/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

/**
 * 👑 LUXURY OVERHAUL: Centered Minimalist Registration Card (Nangalia Ruchira Style)
 *
 * Elegant centered single-panel layout:
 * - Removed the bulky split aside panel completely for a clean, editorial look.
 * - 🔒 FIXED: Password input area is now 100% full width, matching all other inputs exactly!
 * - Smooth entrance animations on mount.
 */
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
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(registerForm.mobile)) {
      return toast.error("Please enter a valid 10-digit mobile number.");
    }

    const success = await handleRegister(e);
    if (success) router.replace(safeRedirect);
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
            Create Account
          </h1>
        </div>

        {/* Form elements */}
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="text"
            name="username"
            value={registerForm.username}
            onChange={handleInputChange}
            placeholder="Username"
            className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
          />

          <input
            type="email"
            name="email"
            value={registerForm.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
          />

          <input
            type="tel"
            name="mobile"
            value={registerForm.mobile}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            inputMode="numeric"
            maxLength={10}
            className="w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition shadow-xs"
          />

          {/* 🔒 FIXED: Password container uses relative + absolute Eye placement, forcing input to be 100% full-width */}
          <div className="relative w-full rounded-md border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 px-4 py-3.5 flex items-center justify-between focus-within:border-[#6A0F1F] dark:focus-within:border-[#e4e198] transition shadow-xs">
            <input
              type={visible ? "text" : "password"}
              name="password"
              value={registerForm.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full bg-transparent text-xs text-neutral-800 dark:text-neutral-200 tracking-wide outline-none pr-8"
            />
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-4 text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition cursor-pointer"
            >
              {visible ? <EyeIcon size={16} /> : <EyeClosedIcon size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white transition duration-300 cursor-pointer shadow-md"
          >
            Create Account
          </button>

          <div className="text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400 pt-4 border-t border-neutral-100 dark:border-neutral-900">
            Already have an account?{" "}
            <Link
              href="login"
              className="underline text-[#6A0F1F] dark:text-[#e4e198] hover:text-neutral-900 dark:hover:text-white font-bold transition ml-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
