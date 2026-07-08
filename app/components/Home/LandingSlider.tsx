"use client";

import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { landingPages } from "@/Data/LandingPages";

// import { landingPages } from "@/data/landingPages";

export default function LandingSlider() {
  const topLandingPages = landingPages.filter((page) => page.featured);

  return (
    <section className="px-6 md:px-10 py-10  dark:bg-black bg-[#fffaf6]">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="rounded-4xl overflow-hidden"
      >
        {topLandingPages.map((page) => (
          <SwiperSlide key={page.slug}>
            <Link href={`/lp/${page.slug}/index.html`}>
              <div className="relative overflow-hidden group cursor-pointer h-105 md:h-130">
                <Image
                  src={page.image}
                  alt={page.title}
                  width={2000}
                  height={760}
                  priority
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                  <p className="uppercase tracking-[0.35em] text-xs mb-4">
                    {page.tag}
                  </p>

                  <h2 className="text-4xl md:text-6xl font-light leading-tight mb-4">
                    {page.title}
                  </h2>

                  <p className="max-w-md text-sm md:text-base text-white/80 mb-6">
                    {page.description}
                  </p>

                  <div className="inline-flex items-center gap-3 border border-white/40 px-6 py-3 rounded-full text-sm tracking-[0.2em] hover:bg-white hover:text-black transition">
                    EXPLORE COLLECTION →
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
