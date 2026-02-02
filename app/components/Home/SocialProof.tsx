"use client";

import { AiFillStar } from "react-icons/ai";
import Carousel from "@/components/UI/Carousel";

const SocialProof = () => {
  return (
    <aside className="p-5 flex justify-between">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-8 p-[10vh]">
        <h2 className="text-[3rem] font-semibold text-[#2B2B2B] leading-tight">
          Trusted by Thousands.
          <br />
          Worn Every Day.
        </h2>

        {/* Hero rating */}
        <div className="flex items-center pl-10 gap-4">
          <span className="text-[3.5rem] font-bold text-[#2B2B2B]">
            4.8
          </span>

          <div>
            <div className="flex gap-1 text-yellow-400">
              <AiFillStar className="w-5 h-5" />
              <AiFillStar className="w-5 h-5" />
              <AiFillStar className="w-5 h-5" />
              <AiFillStar className="w-5 h-5" />
              <AiFillStar className="w-5 h-5" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              From 2,300+ verified purchases
            </p>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="flex flex-col gap-2 pl-10 text-xl text-gray-600">
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
        <p className="text-gray-600 pl-10 leading-relaxed">
          Honest feedback from customers who value comfort, quality, and fit.
          Every review you see comes from a real order.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ height: "800px", position: "relative" }}>
        <Carousel
          baseWidth={500}
          autoplay
          autoplayDelay={4000}
          pauseOnHover
          loop
        />
      </div>
    </aside>
  );
};

export default SocialProof;
