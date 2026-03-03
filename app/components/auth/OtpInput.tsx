"use client";

import { useRef } from "react";

type Props = {
  value: string[];
  setValue: (val: string[]) => void;
  length?: number;
  onComplete?: (otp: string) => void;
};

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
    <div className="flex gap-4 justify-center mt-2">
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
          className="
            w-12 h-12
            text-center text-lg font-semibold
            rounded-xl
            bg-white
            border border-[#e6d8c8]
            text-[#5f5143]
            outline-none
            transition-all duration-200
            focus:border-[#6a0f1f]
            focus:scale-105
          "
        />
      ))}
    </div>
  );
}
