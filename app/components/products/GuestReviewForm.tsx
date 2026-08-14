/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Star, Check } from "lucide-react";
import { toast } from "sonner";

type GuestReviewFormProps = {
  productId: number;
  color?: string;
  design?: string;
  onReviewSubmitted?: () => void;
};

declare global {
  interface Window {
    initSendOTP: (config: {
      widgetId: string;
      tokenAuth: string;
      exposeMethods?: boolean;
      success?: (data: any) => void;
      failure?: (error: any) => void;
    }) => void;

    sendOtp: (
      mobile: string,
      success?: (data: any) => void,
      failure?: (err: any) => void,
    ) => void;

    verifyOtp: (
      otp: string,
      success?: (data: any) => void,
      failure?: (error: any) => void,
      reqId?: string,
    ) => void;
  }
}

export default function GuestReviewForm({
  productId,
  color = "",
  design = "",
  onReviewSubmitted,
}: GuestReviewFormProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  // --------------------------------------------------
  // Initialize MSG91
  // --------------------------------------------------
  const initMsg91 = () => {
    if (sdkInitialized) return true;

    if (typeof window.initSendOTP !== "function") {
      console.error("MSG91 initSendOTP not available");
      return false;
    }

    window.initSendOTP({
      widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID!,
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN!,
      exposeMethods: true,

      success: (data: any) => {
        console.log("MSG91 Guest Review Success:", data);
      },

      failure: (err: any) => {
        console.error("MSG91 Guest Review Failure:", err);
      },
    });

    setSdkInitialized(true);

    return true;
  };

  useEffect(() => {
    // If MSG91 has already been loaded elsewhere in the application,
    // initialize it immediately.
    if (
      typeof window !== "undefined" &&
      typeof window.initSendOTP === "function"
    ) {
      setSdkLoaded(true);
      initMsg91();
    }
  }, []);

  // --------------------------------------------------
  // Send OTP
  // --------------------------------------------------
  const handleSendOtp = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    // MSG91 may already be loaded by another component.
    // Always check the actual global method before sending.
    if (typeof window.initSendOTP !== "function") {
      toast.error("OTP service is still loading. Please try again.");
      return;
    }

    setSdkLoaded(true);

    initMsg91();

    if (typeof window.sendOtp !== "function") {
      toast.error("MSG91 OTP service is not initialized.");
      return;
    }

    setLoading(true);

    try {
      // First apply server-side rate limiting.
      const res = await fetch("/api/reviews/guest/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: mobile,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Unable to send OTP");
      }

      // Make sure the widget has been initialized.
      initMsg91();

      if (typeof window.sendOtp !== "function") {
        throw new Error("MSG91 SDK is not initialized.");
      }

      // Use the exact same working MSG91 method as login.
      window.sendOtp(
        `91${mobile}`,

        () => {
          setLoading(false);
          setOtpSent(true);

          toast.success("OTP sent to your mobile");
        },

        (err) => {
          console.error("MSG91 Guest Review Send Error:", err);

          setLoading(false);

          toast.error(err?.message || "Unable to send OTP");
        },
      );
    } catch (error) {
      console.error("Guest review OTP error:", error);

      setLoading(false);

      toast.error(
        error instanceof Error ? error.message : "Failed to send OTP",
      );
    }
  };

  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }

    if (typeof window.verifyOtp !== "function") {
      toast.error("OTP service is not initialized.");
      return;
    }

    setLoading(true);

    window.verifyOtp(
      otp,

      async (data) => {
        try {
          // MSG91 returns the access token through one of
          // these supported response fields.
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

          // Send the MSG91 access token to our server.
          // The server will verify it independently with MSG91
          // and issue a short-lived review verification token.
          const res = await fetch("/api/reviews/guest/verify-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: mobile,
              token: accessToken,
            }),
          });

          const result = await res.json();

          if (!res.ok || !result.success) {
            setLoading(false);

            return toast.error(result.message || "OTP verification failed");
          }

          // This token proves that this phone number
          // successfully passed OTP verification.
          setVerificationToken(result.verificationToken);

          setPhoneVerified(true);
          setLoading(false);

          toast.success("Mobile number verified");
        } catch (error) {
          console.error("Guest review verification error:", error);

          setLoading(false);

          toast.error(
            error instanceof Error ? error.message : "OTP verification failed",
          );
        }
      },

      (err) => {
        console.error("MSG91 Guest Review Verify Error:", err);

        setLoading(false);

        toast.error(err?.message || "Invalid OTP");
      },
    );
  };

  // --------------------------------------------------
  // Submit review
  // --------------------------------------------------
  const handleSubmit = async () => {
    if (!phoneVerified || !verificationToken) {
      toast.error("Please verify your mobile number first.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reviews/unverified", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name: name.trim(),
          rating,
          comment,
          isAnonymous,
          verificationToken,

          variant: {
            color,
            design,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");

      onReviewSubmitted?.();
    } catch (error) {
      console.error("Guest review submission error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-neutral-100 rounded-xl p-6 sm:p-8">
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Your Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={phoneVerified}
            placeholder="Enter your name"
            className="w-full mt-3 border border-neutral-200 rounded-md p-3 text-sm outline-none focus:border-[#6A0F1F] disabled:bg-neutral-50"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Mobile Number
          </label>

          <div className="flex gap-2 mt-3">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              disabled={otpSent || phoneVerified}
              placeholder="10-digit mobile number"
              className="flex-1 border border-neutral-200 rounded-md p-3 text-sm outline-none focus:border-[#6A0F1F] disabled:bg-neutral-50"
            />

            {!phoneVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || otpSent}
                className="px-5 border border-neutral-800 text-[9px] uppercase tracking-wider disabled:opacity-40"
              >
                {loading ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
              </button>
            )}
          </div>
        </div>

        {/* OTP */}
        {otpSent && !phoneVerified && (
          <div>
            <label className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Enter OTP
            </label>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit OTP"
                className="flex-1 border border-neutral-200 rounded-md p-3 text-sm tracking-[0.4em] outline-none focus:border-[#6A0F1F]"
              />

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-5 bg-[#6A0F1F] text-white text-[9px] uppercase tracking-wider disabled:opacity-40"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        )}

        {/* Verified */}
        {phoneVerified && (
          <div className="flex items-center gap-2 text-green-700 text-xs">
            <Check size={14} />
            Mobile number verified
          </div>
        )}

        {/* Review fields */}
        {phoneVerified && (
          <>
            {/* Rating */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase mb-3">
                Your Rating
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                  >
                    <Star
                      size={20}
                      className={
                        value <= rating
                          ? "fill-[#6A0F1F] text-[#6A0F1F]"
                          : "text-neutral-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Your Review
              </label>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Tell us about your experience..."
                className="w-full mt-3 border border-neutral-200 rounded-md p-3 text-sm outline-none focus:border-[#6A0F1F] resize-none"
              />
            </div>

            {/* Anonymous */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="accent-[#6A0F1F]"
              />

              <span className="text-xs text-neutral-600">
                Post this review anonymously
              </span>
            </label>

            {/* Variant */}
            {(color || design) && (
              <div className="flex flex-wrap gap-2">
                {color && (
                  <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 text-[9px] uppercase tracking-wider text-neutral-500">
                    Color: {color}
                  </span>
                )}

                {design && (
                  <span className="px-3 py-1.5 bg-neutral-50 border border-neutral-100 text-[9px] uppercase tracking-wider text-neutral-500">
                    Design: {design}
                  </span>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !rating}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#6A0F1F] text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-md hover:bg-neutral-900 transition disabled:opacity-40"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </>
        )}
      </div>

      {/* MSG91 SDK */}
      <Script
        src="https://verify.msg91.com/otp-provider.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("MSG91 Guest Review Loaded");

          setSdkLoaded(true);
          initMsg91();
        }}
      />
    </div>
  );
}
