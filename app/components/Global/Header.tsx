"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Play } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const HERO_BANNERS = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584189/banner1_f58cni.png",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1783584186/mobilebanner1_vxjcjw.png",
    title: "Heritage Handcrafted",
    subtitle:
      "Our festive edit redefines traditional Indian craftsmanship. Lightweight, breathable silks and cottons woven into timeless, fluid silhouettes designed to celebrate you.",
    buttonText: "Shop the Edit",
    href: "/collections/ethnic-collection",
    previewHref: "/collections/ethnic-collection",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584187/banner2_aqoqvy.png",
    title: "Effortless Coordinates",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1783584186/mobilebanner2_o3dtk9.png",
    subtitle:
      "Redefining everyday luxury. Clean geometric cuts, premium breathable fabrics, and contemporary co-ords crafted to elevate your active presence without effort.",
    buttonText: "Explore Co-Ords",
    href: "/collections/co-ord-collection",
    previewHref: "/collections/co-ord-collection",
  },
];

export default function CampaignSection() {
  const [showVideo, setShowVideo] = useState(false);

  // Close video modal on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* 👑 EDITORIAL HERO CAROUSEL (Nangalia Ruchira Theme) */}
      <section className="bg-[#fcfbfa] dark:bg-black py-12 md:py-16 transition-colors duration-300">
        <div className="mx-auto px-4 max-w-7xl">
          {/* ================= SECTION 1: HEADER TEXT & STATS (Fully Overhauled with Premium Copywriting & Animations) ================= */}
          <div className="hidden md:block mx-auto mb-16 max-w-4xl text-center space-y-8">
            {/* Curated Season subtitle (Smooth fade in) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center gap-4"
            >
              <span className="h-px w-10 bg-neutral-200 dark:bg-neutral-800" />
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.35em] uppercase">
                Autumn · Winter 2026
              </p>
              <span className="h-px w-10 bg-neutral-200 dark:bg-neutral-800" />
            </motion.div>

            {/* 🔒 FIXED COPYWRITING & ANIMATIONS: 
                - Replaced standard header with the highly poetic "Sartorial poetry, crafted to be lived in" brand statement.
                - Applied a gorgeous, slow-easing opacity and blur slide-up reveal that looks incredibly premium on mount.
            */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom smooth cubic-bezier easing
              className="font-serif text-4xl md:text-6xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight"
            >
              Sartorial poetry, crafted to be
              <span className="block italic font-light text-[#6A0F1F] dark:text-[#e4e198] lowercase mt-1">
                lived in
              </span>
            </motion.h1>

            {/* Captivating, emotional high-fashion description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="max-w-2xl mx-auto text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-light font-sans tracking-wide"
            >
              We create slow, intentional garments for the modern soul. Explore
              refined silhouettes, handcrafted premium fabrics, and timeless
              pieces made to feel effortless today and remain unforgettable
              tomorrow.
            </motion.p>

            {/* Stats Grid & Buttons Group (Glide up smoothly) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="pt-2 flex justify-center items-center gap-8 text-center max-w-lg mx-auto">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#6A0F1F] dark:text-[#e4e198]">
                    50+
                  </h3>
                  <p className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase mt-1">
                    Premium Styles
                  </p>
                </div>

                <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#6A0F1F] dark:text-[#e4e198]">
                    300+
                  </h3>
                  <p className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase mt-1">
                    Happy Customers
                  </p>
                </div>

                <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />

                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#6A0F1F] dark:text-[#e4e198]">
                    100%
                  </h3>
                  <p className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase mt-1">
                    Quality Guarantee
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-center gap-4 pt-2">
                <Link
                  href="/collection"
                  className="bg-[#6A0F1F] text-white hover:bg-neutral-900 transition-all duration-300 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm shadow-md"
                >
                  Explore Collection
                </Link>

                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 border border-neutral-300 hover:border-neutral-800 text-neutral-800 bg-white hover:bg-neutral-50 transition-all duration-300 px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm cursor-pointer"
                >
                  <Play size={10} fill="currentColor" strokeWidth={0} />
                  Brand Story
                </button>
              </div>
            </motion.div>
          </div>

          {/* ================= SECTION 2: THE MAIN SWIPER SLIDER ================= */}
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            loop={true}
            className="rounded-2xl overflow-hidden shadow-xs border border-neutral-100/50 dark:border-neutral-900/50"
          >
            {HERO_BANNERS.map((banner) => (
              <SwiperSlide key={banner.title}>
                <div className="relative h-120 sm:h-130 md:h-auto md:aspect-21/9 overflow-hidden">
                  {/* Mobile Image */}
                  <Image
                    src={banner.mobileimage}
                    alt={banner.title}
                    fill
                    priority={banner.id === 1}
                    fetchPriority={banner.id === 1 ? "high" : "auto"}
                    loading={banner.id === 1 ? "eager" : "lazy"}
                    sizes="(max-width: 767px) calc(100vw - 2rem), 0px"
                    className="object-cover md:hidden"
                  />

                  {/* Desktop Image */}
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    priority={banner.id === 1}
                    fetchPriority={banner.id === 1 ? "high" : "auto"}
                    loading={banner.id === 1 ? "eager" : "lazy"}
                    sizes="(max-width: 767px) 0px, calc(100vw - 2rem)"
                    className="hidden object-cover md:block"
                  />

                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-end md:items-center">
                    <div className="w-full max-w-xl p-6 pb-10 md:p-12 text-white space-y-4">
                      <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/90 font-medium">
                        Featured Highlight
                      </p>

                      <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light tracking-wide uppercase leading-tight text-white">
                        {banner.title}
                      </h2>

                      <p className="hidden md:block text-xs sm:text-sm text-white/80 leading-relaxed font-light tracking-wide font-sans">
                        {banner.subtitle}
                      </p>

                      <div className="pt-2">
                        <Link
                          href={banner.href}
                          className="border border-white hover:bg-white hover:text-neutral-900 transition-all duration-300 px-7 py-3.5 text-[10px] tracking-widest uppercase font-semibold inline-flex rounded-xs"
                        >
                          {banner.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

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
