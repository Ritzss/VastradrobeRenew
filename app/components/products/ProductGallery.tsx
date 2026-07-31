"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper core styles
import "swiper/css";
import "swiper/css/pagination";

interface Props {
  images: string[];
  openGallery: () => void;
}

/**
 * 👑 LUXURY REDESIGN: Product Image Gallery (Nangalia Ruchira Theme)
 *
 * Highly responsive image gallery layout:
 * - 🖥️ Desktop (hidden md:block): Premium geometric grid layout with multi-layered rows and soft scale zooms.
 * - 📱 Mobile (md:hidden): Ultra-clean, edge-to-edge Swiper Carousel with minimalist horizontal pagination bars.
 * - Sizing: Standardized all borders to rounded-2xl to match design overrides.
 */
export default function ProductGallery({ images, openGallery }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full select-none">
      {/* ================= 📱 MOBILE VIEW: Elegant Swiper Carousel ================= */}
      <div className="block md:hidden w-full relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={images.length > 1}
          className="w-full h-full"
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="relative w-full h-full overflow-hidden cursor-pointer"
              onClick={openGallery}
            >
              <Image
                src={image}
                alt={`Product Image ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover object-top pointer-events-none"
                sizes="100vw"
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ================= 🖥️ DESKTOP VIEW: High-End Geometric Grid ================= */}
      <div className="hidden md:block space-y-4 w-full">
        {/* Hero Image */}
        <div
          onClick={openGallery}
          className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 cursor-pointer group"
        >
          <Image
            src={images[0]}
            alt=""
            fill
            priority
            className="object-cover object-top transition duration-700 ease-out group-hover:scale-103 pointer-events-none"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        {/* Second Row */}
        {images.length > 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={openGallery}
              className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 cursor-pointer group"
            >
              <Image
                src={images[1]}
                alt=""
                fill
                className="object-cover object-top transition duration-700 ease-out group-hover:scale-103 pointer-events-none"
                sizes="25vw"
                draggable={false}
              />
            </div>

            <div
              onClick={openGallery}
              className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 cursor-pointer group"
            >
              <Image
                src={images[2]}
                alt=""
                fill
                className="object-cover object-top transition duration-700 ease-out group-hover:scale-103 pointer-events-none"
                sizes="25vw"
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* Third Row (Trigger overlay to open full modal) */}
        {images.length > 3 && (
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={openGallery}
              className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 cursor-pointer group"
            >
              <Image
                src={images[3]}
                alt=""
                fill
                className="object-cover object-top transition duration-700 ease-out group-hover:scale-103 pointer-events-none"
                sizes="25vw"
                draggable={false}
              />
            </div>

            <button
              onClick={openGallery}
              className="relative aspect-4/5 overflow-hidden rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 cursor-pointer group"
            >
              <Image
                src={images[4] || images[3]}
                alt=""
                fill
                className="object-cover object-top brightness-50 transition duration-700 ease-out group-hover:scale-103 pointer-events-none"
                sizes="25vw"
                draggable={false}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 className="text-4xl font-serif font-light tracking-wide uppercase leading-none">
                  +{Math.max(images.length - 4, 0)}
                </h2>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white/85">
                  View Series
                </p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
