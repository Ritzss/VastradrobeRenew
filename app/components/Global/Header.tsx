"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const assets = [
  {
    video:
      "https://res.cloudinary.com/dwhn5ec09/video/upload/v1771305979/main-video_a4rarc.mp4",
  },
  { image: "/Assets/Images/slider2.png" },
  { image: "/Assets/Images/slider3.png" },
  { image: "/Assets/Images/slider4.png" },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % assets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  /* ---------------- ARROWS ---------------- */
  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? assets.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === assets.length - 1 ? 0 : prev + 1));
  };

  /* ---------------- SWIPE ---------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) nextSlide(); // swipe left
    if (distance < -50) prevSlide(); // swipe right

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <header
      className="relative my-10 overflow-hidden rounded-2xl h-[25vh] sm:h-[55vh] md:h-[75vh] w-[95%] m-auto mt-[13vh] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {assets.map((src, index) => (
          <div
            key={index}
            className="relative min-w-full h-full overflow-hidden"
          >
            {/* Media */}
            {src.video && (
              <video
                src={src.video}
                className="w-full h-full object-fill scale-105 transition-transform duration-4000 group-hover:scale-110"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            )}

            {src.image && (
              <Image
                src={src.image}
                fill
                loading="eager"
                className="object-fill scale-105 transition-transform duration-4000 group-hover:scale-110"
                alt=""
              />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* TEXT CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-20 text-white z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-wide">
          Elevate Your Style
        </h1>

        <p className="text-sm sm:text-lg md:text-xl max-w-md mb-6 text-white/80">
          Discover curated fashion for every moment.
        </p>

        <Link
          href="products"
          className="relative overflow-hidden border border-white px-8 py-3 rounded-full text-sm sm:text-base transition-all duration-300 hover:bg-white hover:text-[#6a0f1f]"
        >
          Shop Now
        </Link>
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 sm:left-6 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition z-10"
      >
        <FaChevronLeft />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 sm:right-6 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition z-10"
      >
        <FaChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3 z-10">
        {assets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 
        ${
          current === index
            ? "bg-white scale-125 shadow-md"
            : "bg-white/40 hover:bg-white/70"
        }`}
          />
        ))}
      </div>
    </header>
  );
}
