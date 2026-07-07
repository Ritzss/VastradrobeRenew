"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPlay, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// const banners = [
//   {
//     image: "/Assets/Images/banner3.png",
//     title: "New Collection",
//     subtitle: "Discover timeless elegance.",
//   },
//   {
//     image: "/Assets/Images/banner1.png",
//     title: "Festive Edit",
//     subtitle: "Celebrate in style.",
//   },
//   {
//     image: "/Assets/Images/banner2.png",
//     title: "Everyday Luxe",
//     subtitle: "Designed for every moment.",
//   },
// ];

const HERO_BANNERS = [
  // {
  //   id: 1,
  //   image: "/Assets/Images/banner3.png",
  //   title: "New Collection",
  //   subtitle: "Discover timeless elegance.",
  //   buttonText: "Shop Collection",
  //   href: "/collection/new",
  //   previewHref: "/collection/new",
  // },
  {
  id: 2,
  image: "/Assets/Images/banner1.png",
  title: "Ethnic Wear Collection",
  subtitle:
    "Shop premium ethnic wear for women including kurta sets, festive outfits, elegant suits, and traditional styles for every celebration.",
  buttonText: "Shop Ethnic Wear",
  href: "/collections/ethnic-collection",
  previewHref: "/collections/ethnic-collection",
},
{
  id: 3,
  image: "/Assets/Images/banner2.png",
  title: "Co-Ord Sets Online",
  subtitle:
    "Discover stylish women's co-ord sets, office wear co-ord sets, cotton co-ord sets, and western outfits designed for everyday comfort and elegance.",
  buttonText: "Shop Co-Ord Sets",
  href: "/collections/co-ord-collection",
  previewHref: "/collections/co-ord-collection",
},
];

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
      <section className="bg-[#f8f4ef] py-10 lg:py-5">
        <div className="mx-auto px-4">
          {/* Heading

          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#957f6a]">
              New Collection
            </p>

            <h1 className="mt-4 text-4xl font-semibold text-[#5f5143] md:text-6xl">
              Timeless Elegance
            </h1>

            <p className="mt-6 text-[#7b6a58]">
              Curated silhouettes crafted for modern expression and refined
              presence.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/collection"
                className="rounded-full bg-[#6a0f1f] px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#4d0b18]"
              >
                Explore Collection
              </Link>

              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center gap-3 rounded-full border border-[#6a0f1f] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[#6a0f1f] transition hover:bg-[#6a0f1f] hover:text-white"
              >
                <FaPlay size={12} />
                Watch Video
              </button>
            </div>
          </div> */}
          {/* Heading */}
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#c7b29b]" />

              <p className="text-xs font-medium uppercase tracking-[0.45em] text-[#957f6a]">
                Autumn · Winter 2026
              </p>

              <span className="h-px w-12 bg-[#c7b29b]" />
            </div>

            <h1 className="text-5xl font-semibold leading-tight text-[#5f5143] md:text-7xl">
              Designed to
              <span className="block italic font-light text-[#8c5d4d]">
                Be Remembered
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#7b6a58]">
              Discover refined silhouettes, luxurious fabrics, and timeless
              pieces created for every occasion. Fashion that feels effortless
              today and unforgettable tomorrow.
            </p>

            {/* Stats */}

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
              <div>
                <h3 className="text-2xl font-semibold text-[#6a0f1f]">50+</h3>
                <p className="mt-1 text-sm uppercase tracking-widest text-[#957f6a]">
                  Premium Styles
                </p>
              </div>

              <div className="h-10 w-px bg-[#d7c8b6]" />

              <div>
                <h3 className="text-2xl font-semibold text-[#6a0f1f]">300+</h3>
                <p className="mt-1 text-sm uppercase tracking-widest text-[#957f6a]">
                  Happy Customers
                </p>
              </div>

              <div className="h-10 w-px bg-[#d7c8b6]" />

              <div>
                <h3 className="text-2xl font-semibold text-[#6a0f1f]">100%</h3>
                <p className="mt-1 text-sm uppercase tracking-widest text-[#957f6a]">
                  Premium Quality
                </p>
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link
                href="/collection"
                className="group rounded-full bg-[#6a0f1f] px-9 py-3 text-sm uppercase tracking-[0.25em] text-white transition duration-300 hover:scale-105 hover:bg-[#4d0b18]"
              >
                Explore Collection
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 inline-block">
                  →
                </span>
              </Link>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 rounded-full border border-[#6a0f1f] px-9 py-3 text-sm uppercase tracking-[0.25em] text-[#6a0f1f] transition duration-300 hover:bg-[#6a0f1f] hover:text-white"
              >
                <FaPlay
                  size={12}
                  className="transition-transform duration-300 group-hover:scale-125"
                />
                Brand Story
              </button>
            </div>
          </div>

          {/* Main Slider */}

          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
            className="rounded-3xl"
          >
            {HERO_BANNERS.map((banner) => (
              <SwiperSlide key={banner.title}>
                <div className="relative aspect-21/9 overflow-hidden rounded-3xl">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    priority
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

                  <div className="absolute left-8 top-1/2 max-w-lg -translate-y-1/2 text-white">
                    <p className="mb-2 uppercase tracking-[0.3em] text-sm">
                      Featured
                    </p>

                    <h2 className="text-4xl font-semibold lg:text-6xl">
                      {banner.title}
                    </h2>

                    <p className="mt-4 text-white/80">{banner.subtitle}</p>

                    <Link
                      href={banner.href}
                      className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-[#6a0f1f] transition hover:scale-105"
                    >
                      {banner.buttonText}
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Preview Cards */}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {HERO_BANNERS.slice(0).map((banner) => (
              <Link
                href={banner.previewHref}
                key={banner.title}
                className="group"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-semibold">{banner.title}</h3>

                    <p className="mt-2 text-white/80">{banner.buttonText} →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VIDEO OVERLAY ================= */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-100 animate-fadeIn"
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
