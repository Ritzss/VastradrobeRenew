"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlay, FaTimes } from "react-icons/fa";

export default function CampaignSection() {
  const [showVideo, setShowVideo] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center text-center bg-[#edddc8] overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1770977218/products/ocktsxwyzhi2rzwoantd.jpg"
          alt="Hero"
          fill
          priority
          className="object-cover object-center scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-6 text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-wide">
            Timeless Elegance
          </h1>

          <p className="mt-6 text-white/80 text-lg sm:text-xl max-w-2xl mx-auto">
            Curated silhouettes crafted for modern expression and refined
            presence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-[#6a0f1f] transition text-sm tracking-widest uppercase">
              Explore Collection
            </button>

            <button
              onClick={() => setShowVideo(true)}
              className="flex justify-center items-center gap-3 px-8 py-3 border border-white text-white rounded-full hover:bg-white hover:text-[#6a0f1f] transition text-sm tracking-widest uppercase"
            >
              <FaPlay size={12} />
              Watch Video
            </button>
          </div>
        </div>
      </section>

      {/* ================= VIDEO OVERLAY ================= */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] animate-fadeIn"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="https://res.cloudinary.com/dwhn5ec09/video/upload/q_auto,f_auto,w_1600/v1771305979/main-video_a4rarc.mp4"
              autoPlay
              controls
              className="w-full rounded-xl"
            />

            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-xl"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
