"use client";

import { AiFillStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { DEFAULT_ITEMS } from "@/components/UI/Carousel";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";
import HorizontalScroll from "../Global/HorizontalScroll";

/**
 * 👑 LUXURY REDESIGN: Community Social Proof (Nangalia Ruchira Theme)
 *
 * Styled for premium single-theme look:
 * - Geometric shape: Swapped bulky rounded-3xl for elegant, clean rounded-2xl.
 * - Backdrop: bg-[#faf9f6] with crisp white card backdrops bg-white.
 * - Header standardized: Spaced uppercase tracked typography.
 * - Quote typography: Soft sans-serif text-neutral-600.
 */
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
    <section className="bg-[#faf9f6] dark:bg-neutral-950 py-20 border-t border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-1"
        >
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Community
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
            Loved by Thousands
          </h2>
        </motion.div>

        {/* Reviews Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {reviews.map((item, index) => {
            const avatarColor = avatarColors[index % avatarColors.length];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-8 text-left shadow-xs transition duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 text-[#ffa600] mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <AiFillStar key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light leading-relaxed mb-6 h-28 font-sans">
                  &quot;{item.description}&quot;
                </p>

                {/* Author Details */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
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
                        className={`w-full h-full ${avatarColor} flex items-center justify-center text-white font-semibold text-xs uppercase`}
                      >
                        {item.title?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 tracking-wider">
                      Verified Buyer
                    </p>
                  </div>
                  {item.proof && (
                    <div
                      onClick={() => setShowVideo(true)}
                      className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex justify-center items-center gap-1.5 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest font-bold ml-auto cursor-pointer transition"
                    >
                      <FaPlay size={8} />
                      Videos
                    </div>
                  )}
                  {showVideo && item.proof && (
                    <div
                      className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-100 animate-fadeIn"
                      onClick={() => setShowVideo(false)}
                    >
                      <div
                        className="relative flex justify-center w-11/12 max-w-2xl bg-white p-6 rounded-2xl shadow-2xl border border-neutral-100"
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
                          className="absolute -top-12 right-0 text-white text-xl p-2 cursor-pointer"
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
          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200 font-sans">
            <span className="text-3xl font-serif font-light text-[#6A0F1F] dark:text-[#e4e198]">
              4.8
            </span>
            <div className="flex gap-1 text-[#ffa600]">
              {Array.from({ length: 5 }).map((_, i) => (
                <AiFillStar key={i} className="w-4 h-4" />
              ))}
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 mt-2">
            From 2,300+ verified purchases
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
