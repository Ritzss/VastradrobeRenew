"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Asset = {
  id: string;
  url: string;
  resource_type: "image" | "video";
};

export default function Slider() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  /* ---------- FETCH HERO ASSETS ---------- */
  useEffect(() => {
    const fetchAssets = async () => {
      const res = await fetch("/api/home/cloudinary-hero");
      const data = await res.json();
      setAssets(data.assets || []);
    };

    fetchAssets();
  }, []);

  /* ---------- AUTO SLIDE ---------- */
  useEffect(() => {
    if (isPaused || assets.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % assets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, assets]);

  /* ---------- ARROWS ---------- */
  const prevSlide = () => {
    if (assets.length <= 1) return;
    setCurrent((prev) => (prev === 0 ? assets.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (assets.length <= 1) return;
    setCurrent((prev) => (prev === assets.length - 1 ? 0 : prev + 1));
  };

  /* ---------- SWIPE ---------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };



 if (!assets.length) {
  return (
    <header className="relative my-10 overflow-hidden h-[35vh] sm:h-[55vh] md:h-screen w-full m-auto bg-gray-200 animate-pulse" />
  );
}

  return (
    <header
      className="relative my-10 overflow-hidden h-[35vh] sm:h-[55vh] md:h-screen w-full m-auto group"
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
        {assets.map((asset, index) => (
          <div
            key={asset.id}
            className="relative min-w-full h-full overflow-hidden"
          >
            {asset.resource_type === "video" && index === current ? (
              <video
                src={asset.url || "https://res.cloudinary.com/dwhn5ec09/video/upload/v1771305979/main-video_a4rarc.mp4"}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image src={asset.url} fill className="object-cover" alt="Hero" />
            )}

            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* TEXT */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-12 md:px-20 text-white z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-wide">
          Elevate Your Style
        </h1>
        <p className="text-sm sm:text-lg md:text-xl max-w-md mb-6 text-white/80">
          Discover curated fashion for every moment.
        </p>
        <Link
          href="product"
          className="border border-white px-8 py-3 rounded-full transition hover:bg-white hover:text-[#6a0f1f]"
        >
          Shop Now
        </Link>
      </div>

      {/* ARROWS (only if more than 1) */}
      {assets.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full z-10"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </header>
  );
}
