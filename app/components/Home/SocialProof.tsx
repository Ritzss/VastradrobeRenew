"use client";

import { AiFillStar } from "react-icons/ai";
import Carousel from "@/components/UI/Carousel";

const SocialProof = () => {
  return (
    <aside
      className="
        max-w-7xl mx-auto
        px-4 md:px-8
        py-16
        flex flex-col md:flex-row
        gap-12 md:gap-16
        items-center md:items-start
      "
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-8 md:gap-10 w-full md:w-1/2">
        <h2 className="text-2xl sm:text-3xl md:text-[3rem] font-semibold text-[#2B2B2B] leading-tight">
          Trusted by Thousands.
          <br className="hidden sm:block" />
          Worn Every Day.
        </h2>

        {/* Hero rating */}
        <div className="flex items-center gap-4">
          <span className="text-3xl md:text-[3.5rem] font-bold text-[#2B2B2B]">
            4.8
          </span>

          <div>
            <div className="flex gap-1 text-yellow-400">
              <AiFillStar className="w-4 h-4 md:w-5 md:h-5" />
              <AiFillStar className="w-4 h-4 md:w-5 md:h-5" />
              <AiFillStar className="w-4 h-4 md:w-5 md:h-5" />
              <AiFillStar className="w-4 h-4 md:w-5 md:h-5" />
              <AiFillStar className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              From 2,300+ verified purchases
            </p>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="flex flex-col gap-2 text-base md:text-lg text-gray-600">
          <div className="flex gap-2">
            ★★★★★ <span>78%</span>
          </div>
          <div className="flex gap-2">
            ★★★★☆ <span>15%</span>
          </div>
          <div className="flex gap-2">
            ★★★☆☆ <span>7%</span>
          </div>
        </div>

        {/* Supporting copy */}
        <p className="text-gray-600 leading-relaxed max-w-xl">
          Honest feedback from customers who value comfort, quality, and fit.
          Every review you see comes from a real order.
        </p>
      </div>

      <div className="w-full flex justify-center">
        {/* Mobile */}
        <div className="block sm:hidden">
          <Carousel
            baseWidth={280}
            autoplay
            autoplayDelay={4000}
            pauseOnHover
            loop
          />
        </div>

        {/* Tablet */}
        <div className="hidden sm:block md:hidden">
          <Carousel
            baseWidth={360}
            autoplay
            autoplayDelay={4000}
            pauseOnHover
            loop
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <Carousel
            baseWidth={500}
            autoplay
            autoplayDelay={4000}
            pauseOnHover
            loop
          />
        </div>
      </div>
    </aside>
  );
};

export default SocialProof;
