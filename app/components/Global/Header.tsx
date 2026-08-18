"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Play } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useAppContext } from "@/hooks/useAppContext";
import { motion } from "framer-motion";

// Import Swiper core styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HERO_BANNERS = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584189/banner1_f58cni.png",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1786688262/Hero1Banner_r3rjnc.png",
    title: "Heritage Handcrafted",
    subtitle:
      "Our festive edit redefines traditional Indian craftsmanship. Lightweight, breathable silks and cottons woven into timeless, fluid silhouettes designed to celebrate you.",
    buttonText: "Discover Heritage",
    href: "/collections/ethnic-collection",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584187/banner2_aqoqvy.png",
    title: "Effortless Coordinates",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1786688262/Hero2Banner_ux2urh.png",
    subtitle:
      "Redefining everyday luxury. Clean geometric cuts, premium breathable fabrics, and contemporary co-ords crafted to elevate your active presence without effort.",
    buttonText: "Explore Co-Ords",
    href: "/collections/co-ord-collection",
  },
];

/**
 * 👑 LUXURY REDESIGN: Hero Section (Kalki & Nangalia Ruchira Aesthetic)
 *
 * Sizing & Layout Refined:
 * - 🔒 REMOVED TOP TEXT: Completely deleted the busy static heading text, stats counter,
 *   and brand story button above the slideshow.
 * - 🎡 FULL-BLEED BANNERS: Starts the homepage directly with these gorgeous, full-bleed
 *   immersive editorial swiper banners at the absolute top of the page.
 * - 🎀 STYLIZED NAV DOTS: Re-enabled the Swiper pagination dots and styled them as gorgeous,
 *   minimalist luxury horizontal slide-bars inside globals.css.
 */
export default function CampaignSection() {
  const [showVideo, setShowVideo] = useState(false);
  const { isLoaderFinished } = useAppContext();

  // Close video modal on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!isLoaderFinished) {
    return (
      <div className="h-[65vh] sm:h-[75vh] md:h-[85vh] w-full bg-white dark:bg-black" />
    );
  }

  return (
    <>
      {/* 👑 EDITORIAL HERO CAROUSEL (Full-Bleed Luxury Slider at the absolute top of the page with a smooth cinematic fade-in) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }} // Slow, elegant luxury fade-in
        className="relative w-full overflow-hidden bg-white dark:bg-black"
      >
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          loop
          className="w-full"
        >
          {HERO_BANNERS.map((banner) => (
            <SwiperSlide
              key={banner.id}
              className="relative w-full overflow-hidden"
            >
              {/* ================= MOBILE ================= */}
              <div className="relative block md:hidden w-full aspect-197/240">
                <Image
                  src={banner.mobileimage}
                  alt={banner.title}
                  fill
                  priority={banner.id === 1}
                  fetchPriority={banner.id === 1 ? "high" : "auto"}
                  loading={banner.id === 1 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              {/* ================= DESKTOP ================= */}
              <div className="relative hidden md:block w-full aspect-20/9">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority={banner.id === 1}
                  fetchPriority={banner.id === 1 ? "high" : "auto"}
                  loading={banner.id === 1 ? "eager" : "lazy"}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>

              {/* ================= OVERLAY ================= */}
              <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent dark:from-black/75 dark:via-black/35 dark:to-transparent" />

              {/* ================= CONTENT ================= */}
              <div className="absolute inset-0 flex items-center justify-start px-5 sm:px-8 md:px-10 lg:px-20 xl:px-28">
                <div className="w-full max-w-xl lg:max-w-2xl text-white text-left space-y-3 sm:space-y-4 lg:space-y-6 z-10 font-sans">
                  {/* <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.25em] lg:tracking-[0.35em] text-white/90 font-medium">
                    Autumn / Winter Edit
                  </p> */}

                  <h2 className="font-serif text-2xl md:text-4xl lg:text-6xl font-light tracking-wide uppercase leading-none text-white drop-shadow-sm">
                    {banner.title}
                  </h2>

                  <p className="text-[11px] md:text-sm lg:text-base text-white/80 max-w-md lg:max-w-lg leading-relaxed font-light tracking-wide">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 pt-1 lg:pt-2">
                    <Link
                      href={banner.href}
                      className="border border-white hover:bg-white hover:text-neutral-900 transition-all duration-300 px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-[9px] sm:text-[10px] lg:text-xs tracking-widest uppercase font-semibold inline-flex rounded-xs"
                    >
                      {banner.buttonText}
                    </Link>
                      <button
                        onClick={() => setShowVideo(true)}
                        className="items-center gap-2 border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300 px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 text-[9px] sm:text-[10px] lg:text-xs tracking-widest uppercase font-semibold inline-flex cursor-pointer"
                      >
                        <Play size={10} fill="white" strokeWidth={0} />
                        Brand Story
                      </button>
                    
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* ================= VIDEO OVERLAY MODAL ================= */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-100"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-[90vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src="https://res.cloudinary.com/dwhn5ec09/video/upload/q_auto,f_auto,w_1600/v1771305979/main-video_a4rarc.mp4"
              autoPlay
              controls
              className="w-full rounded-2xl shadow-2xl border border-white/5"
            />

            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#6A0F1F] transition text-2xl p-2 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
