"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { toast } from "sonner";

type ProductReviewFormProps = {
  productId: number;
  // Present only when the customer is reviewing a purchased product.
  orderId?: string;
  color?: string;
  design?: string;
  // Determines which API endpoint should receive the review.
  verifiedPurchase?: boolean;
  onReviewSubmitted?: () => void;
};

export default function ProductReviewForm({
  productId,
  orderId,
  color = "",
  design = "",
  verifiedPurchase = false,
  onReviewSubmitted,
}: ProductReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // A rating is required before submitting the review.
    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setLoading(true);

      // The server verifies the order and determines whether
      // this review qualifies as a verified purchase.
      const endpoint = verifiedPurchase
        ? "/api/reviews"
        : "/api/reviews/unverified";

      const payload = {
        productId,
        rating,
        comment,
        isAnonymous,

        variant: {
          color,
          design,
        },

        // Only send orderId when the review is a verified purchase.
        ...(verifiedPurchase && orderId ? { orderId } : {}),
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");

      // Reset the form after successful submission.
      setRating(0);
      setComment("");
      setIsAnonymous(false);

      // Tell the parent PDP to reload the reviews.
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Review submission failed:", error);

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
                aria-label={`Rate ${value} out of 5`}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  strokeWidth={1.5}
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

        {/* Review text */}
        <div>
          <label
            htmlFor="review-comment"
            className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase"
          >
            Your Review
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={5}
            maxLength={1000}
            className="w-full mt-3 border border-neutral-200 rounded-md p-3 text-sm text-neutral-700 outline-none focus:border-[#6A0F1F] resize-none"
          />

          <p className="text-[9px] text-neutral-400 text-right mt-1">
            {comment.length}/1000
          </p>
        </div>

        {/* Variant being reviewed */}
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

        {/* Anonymous option */}
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

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !rating}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#6A0F1F] text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-md hover:bg-neutral-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
