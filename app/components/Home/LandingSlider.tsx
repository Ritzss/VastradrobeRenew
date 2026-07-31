"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import { landingPages } from "@/Data/LandingPages";

/**
 * 👑 LUXURY REDESIGN: Landing Slider (Nangalia Ruchira Theme)
 *
 * Styled for premium single-theme look:
 * - 🔒 FIXED WIDTH: Constrained the entire slider inside a centered 'max-w-7xl mx-auto' block
 *   to prevent it from stretching out too wide on large desktop monitors.
 * - Geometric shape: Swapped rounded-4xl for elegant, clean rounded-2xl.
 * - Asymmetrical layout with warm ivory backing (#faf9f6).
 */
export default function LandingSlider() {
  const topLandingPages = landingPages.filter((page) => page.featured);

  return (
    <section className="px-6 sm:px-8 md:px-12 py-10 bg-[#fcfbfa] dark:bg-black transition-colors duration-300">
      {/* 🔒 Constrained container aligns perfectly with the rest of the homepage */}
      <div className="max-w-7xl mx-auto">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect={"fade"}
          slidesPerView={1}
          loop={topLandingPages.length > 4}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          className="rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-neutral-900"
        >
          {topLandingPages.map((page) => (
            <SwiperSlide
              key={page.slug}
              className="bg-[#faf9f6] dark:bg-neutral-950"
            >
              <Link
                href={`/lp/${page.slug}/index.html`}
                className="block w-full"
              >
                {/* Asymmetrical Split Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 h-auto md:h-[500px]">
                  {/* 1. LEFT COLUMN: TEXT NARRATIVE */}
                  <div className="md:col-span-6 lg:col-span-5 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-start text-left bg-[#faf9f6] dark:bg-neutral-950 space-y-4 md:space-y-6">
                    <p className="text-[10px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.3em] uppercase">
                      {page.tag || "Campaign Edit"}
                    </p>

                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
                      {page.title}
                    </h2>

                    <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed font-light font-sans tracking-wide max-w-sm">
                      {page.description}
                    </p>

                    <div className="pt-2">
                      <span className="bg-[#6A0F1F] dark:bg-[#e4e198] hover:bg-neutral-900 dark:hover:bg-white text-white dark:text-neutral-950 font-semibold uppercase tracking-widest px-8 py-3.5 text-[10px] sm:text-xs rounded-sm shadow-md transition-all duration-300">
                        Explore Collection
                      </span>
                    </div>
                  </div>

                  {/* 2. RIGHT COLUMN: EDITORIAL IMAGE */}
                  <div className="md:col-span-6 lg:col-span-7 relative w-full h-80 md:h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={page.image}
                      alt={page.title}
                      fill
                      priority
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-102"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Subtle dark overlay gradient for depth */}
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/15" />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
