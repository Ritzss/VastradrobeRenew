"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import img from '../../../public/Assets/Images/logoV2.png'

interface Props {
  loading: boolean;
}

export default function LandingLoader({ loading }: Props) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center light:bg-white dark:bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.45,
              delay: 0.55,
            },
          }}
        >
          <motion.div
            layoutId="brand-logo"
            animate={{
              rotateY: [0, 12, -12, 0],
              rotateX: [0, -6, 6, 0],
              scale: [1, 1.04, 1],
              y: [0, -5, 0],
            }}
            transition={{
              rotateY: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotateX: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              layout: {
                type: "spring",
                stiffness: 60,
                damping: 22,
                mass: 1.2,
              },
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={img} // Change this
              alt="VastraDrobe"
              width={180}
              height={180}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}