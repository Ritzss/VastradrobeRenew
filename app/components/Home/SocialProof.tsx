"use client";

import { AiFillStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { DEFAULT_ITEMS } from "@/components/UI/Carousel";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import HorizontalScroll from "../Global/HorizontalScroll";

const SocialProof = () => {
  const reviews = DEFAULT_ITEMS.slice(0, 3);
  const [showVideo, setShowVideo] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];

  return (
    <section className=" dark:bg-black bg-[#fff8f8] py-28">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-6">
            Community
          </p>

          <h2 className="text-4xl md:text-5xl text-[#4b4035] font-semibold tracking-wide">
            Loved by Thousands
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-2 mt-10">
          {reviews.map((item, index) => {
           const avatarColor = avatarColors[index % avatarColors.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="dark:bg-black/85 border border-[#FFF0F0] bg-[#FFF0F0] rounded-3xl p-8 text-left"
              >
                {/* Stars */}
                <div className="flex gap-1 text-[#ffa600] mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AiFillStar key={i} className="w-4 h-4" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#5f5143] leading-relaxed mb-8 h-28">
                  &quot;{item.description}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    {item.image && !imageError[item.id] ? (
                      <Image
                        src={item.image}
                        fill
                        alt={item.title || "Reviewer"}
                        className="object-cover"
                        onError={() =>
                          setImageError((prev) => ({
                            ...prev,
                            [item.id]: true,
                          }))
                        }
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${avatarColor} flex items-center justify-center text-white font-semibold text-lg uppercase`}
                      >
                        {item.title?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4b4035]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#8a7b6c]">Verified Buyer</p>
                  </div>
                  {item.proof && (
                    <div
                      onClick={() => setShowVideo(true)}
                      className="bg-[#4b4035] text-[#ebd6c1] flex justify-center items-center gap-2 text-xl rounded-3xl p-1 flex-1 h-full"
                    >
                      <FaPlay size={18} />
                      Videos
                    </div>
                  )}
                  {showVideo && item.proof && (
                    <div
                      className="fixed inset-0 bg-black/9 flex items-center justify-center z-100 animate-fadeIn"
                      onClick={() => setShowVideo(false)}
                    >
                      <div
                        className="relative flex justify-center w-1/2 max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HorizontalScroll color="#00000000">
                          {item.proof.videos?.map((video, ind) => {
                            return (
                              <video
                                key={ind}
                                src={video}
                                controls
                                className="w-3/4 h-3/4 rounded-xl"
                              />
                            );
                          })}
                        </HorizontalScroll>

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
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 text-[#4b4035]">
            <span className="text-3xl font-semibold">4.8</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <AiFillStar key={i} className="w-4 h-4" />
              ))}
            </div>
          </div>

          <p className="text-sm text-[#8a7b6c] mt-2">
            From 2,300+ verified purchases
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
