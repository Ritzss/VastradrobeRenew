"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { FaPlay, FaTimes } from "react-icons/fa";
import { DEFAULT_ITEMS } from "@/components/UI/Carousel";
import HorizontalScroll from "../Global/HorizontalScroll";

/**
 * Community Social Proof
 *
 * Editorial-style customer review section for the homepage.
 *
 * Layout:
 * - Large rating summary
 * - Three customer reviews
 * - Optional video proof
 * - Responsive layout for mobile
 *
 * The component intentionally keeps the visual treatment
 * restrained so the reviews support the shopping experience
 * without becoming another oversized homepage section.
 */
const SocialProof = () => {
  const reviews = DEFAULT_ITEMS.slice(0, 3);

  const [selectedReview, setSelectedReview] =
    useState<(typeof reviews)[number] | null>(null);

  const [imageError, setImageError] =
    useState<Record<number, boolean>>({});

  const avatarColors = [
    "bg-[#6A0F1F]",
    "bg-[#536B78]",
    "bg-[#6D7B58]",
  ];

  return (
    <section className=" border-y border-[#e4ddd4] bg-[#f7f4ee] py-20 transition-colors duration-300 dark:border-neutral-900 dark:bg-neutral-950 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* =================================================
            HEADER
            ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="mb-14 text-center"
        >
          <p className=" text-[9px] font-semibold uppercase tracking-[0.35em] text-[#9a8876]">
            Our Community
          </p>

          <h2 className=" mt-3 font-serif text-4xl font-light tracking-tight text-[#40372f] dark:text-white sm:text-5xl">
            Loved by thousands
          </h2>

          <p className=" mx-auto mt-4 max-w-xl text-xs leading-6 text-[#85766a] dark:text-neutral-400 sm:text-sm">
            Real experiences from customers who chose
            VastraDrobe for their everyday wardrobe.
          </p>
        </motion.div>

        {/* =================================================
            MAIN SOCIAL PROOF LAYOUT
            ================================================= */}

        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr]">

          {/* =================================================
              RATING SUMMARY
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className=" flex flex-col justify-center border border-[#ddd4ca] bg-[#fffdf9] p-8 text-center dark:border-neutral-800 dark:bg-neutral-900 sm:p-10 lg:text-left"
          >
            <p className=" text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9a8876]">
              Customer rating
            </p>

            <div className="mt-5 flex items-center justify-center gap-4 lg:justify-start">
              <span className=" font-serif text-5xl font-light text-[#6A0F1F] dark:text-[#e4e198]">
                4.8
              </span>

              <div>
                <div className="flex gap-1 text-[#c88a1b]">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <AiFillStar
                      key={index}
                      className="h-4 w-4"
                    />
                  ))}
                </div>

                <p className=" mt-1 text-[9px] uppercase tracking-[0.15em] text-[#9a8876]">
                  Excellent
                </p>
              </div>
            </div>

            <div className="my-7 h-px bg-[#e4ddd4] dark:bg-neutral-800" />

            <p className=" text-sm leading-7 text-[#75685c] dark:text-neutral-400">
              Thousands of customers have already
              discovered their next favourite piece
              with VastraDrobe.
            </p>

            <p className=" mt-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9a8876]">
              2,300+ verified purchases
            </p>
          </motion.div>

          {/* =================================================
              REVIEW CARDS
              ================================================= */}

          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((item, index) => {
              const avatarColor =
                avatarColors[
                  index % avatarColors.length
                ];

              return (
                <motion.article
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.12,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className=" group flex min-h-70 flex-col border border-[#e1d9cf] bg-[#fffdf9] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#cbbfb1] hover:shadow-[0_12px_35px_rgba(70,55,40,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                >
                  {/* Stars */}

                  <div className="flex gap-1 text-[#c88a1b]">
                    {Array.from({
                      length: 5,
                    }).map((_, starIndex) => (
                      <AiFillStar
                        key={starIndex}
                        className="h-3.5 w-3.5"
                      />
                    ))}
                  </div>

                  {/* Quote */}

                  <p className=" mt-5 flex-1 text-xs leading-6 text-[#655a51] dark:text-neutral-300">
                    &quot;{item.description}&quot;
                  </p>

                  {/* Divider */}

                  <div className="my-5 h-px bg-[#e9e2d9] dark:bg-neutral-800" />

                  {/* Customer */}

                  <div className="flex items-center gap-3">

                    <div className=" relative h-9 w-9 shrink-0 overflow-hidden rounded-full ">
                      {item.image &&
                      !imageError[item.id] ? (
                        <Image
                          src={item.image}
                          alt={
                            item.title ||
                            "Verified customer"
                          }
                          fill
                          sizes="36px"
                          className="object-cover"
                          onError={() =>
                            setImageError(
                              (previous) => ({
                                ...previous,
                                [item.id]: true,
                              }),
                            )
                          }
                        />
                      ) : (
                        <div className={` flex h-full w-full items-center justify-center ${avatarColor} text-xs font-semibold uppercase text-white `}>
                          {item.title?.charAt(0) ||
                            "U"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className=" truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-[#40372f] dark:text-neutral-200 ">
                        {item.title}
                      </p>

                      <p className=" mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[#9a8876] ">
                        Verified Buyer
                      </p>
                    </div>

                    {/* Video proof */}

                    {item.proof && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReview(item)
                        }
                        className=" ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-[#ddd4ca] px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#66594e] transition-all duration-300 hover:border-[#6A0F1F] hover:bg-[#6A0F1F] hover:text-white dark:border-neutral-700 dark:text-neutral-300"
                      >
                        <FaPlay className="h-2 w-2" />
                        Video
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BOTTOM TRUST STATEMENT
            ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
          viewport={{
            once: true,
          }}
          className=" mt-14 flex flex-col items-center justify-center gap-3 text-center sm:flex-row"
        >
          <span className="h-px w-10 bg-[#d8cec3]" />

          <p
            className=" text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9a8876]"
          >
            Real people · Real experiences · Real style
          </p>

          <span className="h-px w-10 bg-[#d8cec3]" />
        </motion.div>
      </div>

      {/* =================================================
          VIDEO MODAL
          ================================================= */}

      {selectedReview?.proof && (
        <div
          className="  fixed  inset-0  z-100  flex  items-center  justify-center  bg-black/60  p-5  backdrop-blur-sm"
          onClick={() =>
            setSelectedReview(null)
          }
        >
          <div
            className=" relative w-full max-w-3xl overflow-hidden border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setSelectedReview(null)
              }
              className=" absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-[#6A0F1F]"
              aria-label="Close video"
            >
              <FaTimes />
            </button>

            {/* Videos */}

            <HorizontalScroll color="#00000000">
              {selectedReview.proof.videos?.map(
                (video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    playsInline
                    className=" max-h-[75vh] w-auto max-w-full rounded-lg bg-black"
                  />
                ),
              )}
            </HorizontalScroll>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialProof;