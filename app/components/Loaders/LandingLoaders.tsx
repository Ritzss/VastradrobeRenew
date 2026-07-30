"use client";

import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/UI/Logo";

interface Props {
  loading: boolean;
}

export default function LandingLoader({ loading }: Props) {
  // 👑 LUXURY CINEMATIC LOADER
  // - Replaces basic 3D spins with a high-fashion, premium blur-to-focus organic breathing reveal.
  // - Staggered slogan entry with space-expansion letter tracking.
  // - Dramatic curtain-slide backdrop exit to reveal the storefront.

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#fcfbfa] dark:bg-[#110a0b] overflow-hidden origin-top"
            initial={{ opacity: 1, y: "0%" }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: {
                duration: 0.85,
                ease: [0.76, 0, 0.24, 1], // Smooth dramatic theatrical curtain pull
              },
            }}
          >
            {/* Cinematic Logo Group */}
            <div className="flex flex-col items-center justify-center relative select-none">
              {/* Soft luxurious background radial glow */}
              <div className="absolute w-80 h-80 bg-[#6A0F1F]/5 dark:bg-[#e4e198]/3 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  filter: "blur(12px)",
                  y: 15,
                }}
                animate={{
                  opacity: [0, 1, 1],
                  scale: [0.94, 1, 1.02],
                  filter: ["blur(12px)", "blur(0px)", "blur(0px)"],
                  y: [15, 0, -2],
                }}
                transition={{
                  duration: 2.8,
                  times: [0, 0.45, 1],
                  ease: [0.16, 1, 0.3, 1],
                  repeat: Infinity,
                  repeatType: "reverse", // Infinite soft breathing effect
                }}
                className="z-10"
              >
                <div className="w-60 sm:w-72 md:w-80 h-auto">
                  <Logo className="w-full h-full object-contain" />
                </div>
              </motion.div>

              {/* Slogan with luxurious staggered sliding & space-expansion entry */}
              <motion.h3
                initial={{ opacity: 0, y: 10, letterSpacing: "0.15em" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  letterSpacing: "0.24em",
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[10px] sm:text-xs text-[#7a6a5c] dark:text-neutral-400 font-light font-sans uppercase mt-8 text-center"
              >
                Your Modern Indian Wardrobe
              </motion.h3>

              {/* Handcrafted quality accent mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 1.2, delay: 0.9 }}
                className="text-[9px] text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.4em] uppercase font-light mt-4"
              >
                ✦ ✦ ✦
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
