"use client";

import { AiFillStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { DEFAULT_ITEMS } from "@/components/UI/Carousel";
import Image from "next/image";

const SocialProof = () => {
  const reviews = DEFAULT_ITEMS.slice(0, 3);

  return (
    <section className="bg-[#f3e7d8] py-28">
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
        <div className="grid md:grid-cols-3 gap-10 mt-20">
          {reviews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-[#efe3d3] rounded-[24px] p-8 text-left"
            >
              {/* Stars */}
              <div className="flex gap-1 text-[#2b2b2b] mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <AiFillStar key={i} className="w-4 h-4" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#5f5143] leading-relaxed mb-8">
                "{item.description}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={item.image || "/Assets/Images/Profiles/profile.jpg"}
                    fill
                    alt={item.title || "Reviewer"}
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#4b4035]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#8a7b6c]">Verified Buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
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
