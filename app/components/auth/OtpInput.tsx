"use client";

import { useRef } from "react";

type Props = {
  value: string[];
  setValue: (val: string[]) => void;
  length?: number;
  onComplete?: (otp: string) => void;
};

/**
 * 👑 LUXURY REDESIGN: OTP Digits Input (Nangalia Ruchira Theme)
 *
 * Styled for premium look and dark-mode synchronized:
 * - Geometric shape: Swapped old borders for crisp, slightly rounded rectangular fields.
 * - Colors: Fully coordinated with signature Wine-Red (#6A0F1F) and Ivory-Gold (#e4e198).
 */
export default function OtpInput({
  value,
  setValue,
  length = 6,
  onComplete,
}: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (index: number, digit: string) => {
    if (!/^[0-9]?$/.test(digit)) return;

    const newOtp = [...value];
    newOtp[index] = digit;
    setValue(newOtp);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    const joined = newOtp.join("");
    if (joined.length === length && !newOtp.includes("")) {
      onComplete?.(joined);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const newOtp = [...value];
        newOtp[index] = "";
        setValue(newOtp);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.slice(0, length).split("");
    const newOtp = Array(length).fill("");

    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setValue(newOtp);

    if (digits.length === length) {
      onComplete?.(digits.join(""));
    } else {
      focusInput(digits.length);
    }
  };

  return (
    <div className="flex gap-3.5 justify-center mt-2 select-none">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-10 sm:w-12 h-12 text-center text-lg font-serif font-light rounded-md bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white outline-none transition-all duration-300 focus:border-[#6A0F1F] dark:focus:border-[#e4e198] focus:scale-105 shadow-inner"
        />
      ))}
    </div>
  );
}
