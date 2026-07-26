"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { Play } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

const HERO_BANNERS = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584189/banner1_f58cni.png",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1783584186/mobilebanner1_vxjcjw.png",
    title: "Ethnic Wear Collection",
    subtitle:
      "Thoughtfully handcrafted silhouettes, breathable fabrics, and elegant everyday essentials. Curated for timeless celebrations.",
    buttonText: "Shop Collection",
    href: "/collections/ethnic-collection",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_1920,c_limit/v1783584187/banner2_aqoqvy.png",
    mobileimage:
      "https://res.cloudinary.com/dwhn5ec09/image/upload/f_auto,q_auto,w_640,c_limit/v1783584186/mobilebanner2_o3dtk9.png",
    title: "Modern Co-Ord Sets",
    subtitle:
      "Elegantly coordinated Western and fusion wear sets designed for effortless style and premium comfort.",
    buttonText: "Explore Co-Ords",
    href: "/collections/co-ord-collection",
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
      {/* 👑 GEOMETRIC SANS-SERIF HERO CAROUSEL (Full-Bleed Luxury Slider) */}
      <section className="relative w-full overflow-hidden bg-white">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect={"fade"}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-[65vh] sm:h-[75vh] md:h-[85vh] w-full"
        >
          {HERO_BANNERS.map((banner) => (
            <SwiperSlide
              key={banner.id}
              className="relative w-full h-full overflow-hidden"
            >
              {/* Mobile Image */}
              <div className="absolute inset-0 block md:hidden">
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

              {/* Desktop Image */}
              <div className="absolute inset-0 hidden md:block">
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

              {/* Premium Gradient Overlay (Makes white text highly readable while keeping right side bright) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28">
                {/* 🔒 FIXED FONT COMPATIBILITY: All typography uses your website's elegant, clean geometric sans-serif (GeistSans) with premium uppercase tracked spacing instead of generic serif fonts */}
                <div className="w-full max-w-2xl text-white text-left space-y-4 md:space-y-6 z-10 font-sans">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/90 font-medium">
                    Autumn / Winter Edit
                  </p>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider uppercase leading-none text-white drop-shadow-sm">
                    {banner.title}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-lg leading-relaxed font-light tracking-wide">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={banner.href}
                      className="border border-white hover:bg-white hover:text-neutral-900 transition-all duration-300 px-7 sm:px-8 py-3 text-[10px] sm:text-xs tracking-widest uppercase font-semibold inline-flex rounded-xs"
                    >
                      {banner.buttonText}
                    </Link>

                    {/* Integrated Brand Story Button Inside Slider */}
                    {banner.id === 1 && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="flex items-center gap-2 border border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300 px-6 sm:px-7 py-3 text-[10px] sm:text-xs tracking-widest uppercase font-semibold inline-flex cursor-pointer"
                      >
                        <Play size={11} fill="white" strokeWidth={0} />
                        Brand Story
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
