"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";

/**
 * 👑 LUXURY COMPONENT: Fly-To-Cart Jumping Animation (Refined)
 *
 * Provides an incredibly smooth, cinematic micro-interaction:
 * - 🎯 Center Pop & Hold: Renders the added item in the absolute center of the viewport
 *   with an elegant scale-up and fade-in, giving the customer instant, clear feedback.
 * - ☄️ Fluid Bezier Sweep: After holding, it sweeps in a single, continuous, elegant curve
 *   towards the top-right Navbar Shopping Bag icon, rotating, shrinking, and fading out.
 * - 🎬 Cart Trigger: Safely opens the Cart Drawer exactly as the product finishes its transition (1100ms).
 */
export default function FlyToCartAnimation() {
  const { lastAddedProduct, setCartDrawerOpen, setLastAddedProduct } =
    useAppContext();
  const [animatingProduct, setAnimatingProduct] = useState<any>(null);

  useEffect(() => {
    if (lastAddedProduct) {
      setAnimatingProduct(lastAddedProduct);

      // Delay opening of cart drawer until the image completes its leap into the bag
      const timer = setTimeout(() => {
        setCartDrawerOpen(true);
        // Safely reset lastAddedProduct and local state
        setLastAddedProduct(null);
        setAnimatingProduct(null);
      }, 1100);

      return () => clearTimeout(timer);
    }
  }, [lastAddedProduct, setCartDrawerOpen, setLastAddedProduct]);

  if (!animatingProduct) return null;

  const productImg =
    animatingProduct.variant?.designs?.[0]?.images?.[0] ||
    animatingProduct.variant?.images?.[0];

  return (
    <AnimatePresence>
      {animatingProduct && (
        <div className="fixed inset-0 pointer-events-none z-10000 overflow-hidden">
          {/* Backdrop flash effect (Ultra-subtle) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#6A0F1F] dark:bg-white"
          />

          {/* Flying Product Thumbnail Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.3,
              x: "-50%",
              y: "-50%",
              top: "50%",
              left: "50%",
              rotate: 0,
              borderRadius: "20px",
            }}
            animate={{
              opacity: [0, 1, 1, 0.9, 0],
              scale: [0.3, 1.1, 1.0, 0.3, 0.05],
              x: ["-50%", "-50%", "-20%", "30vw", "42vw"],
              y: ["-50%", "-50%", "-40%", "-40vh", "-45vh"],
              rotate: [0, 4, -4, -15, -35],
              borderRadius: ["20px", "16px", "16px", "12px", "50%"],
            }}
            transition={{
              duration: 1.1,
              times: [0, 0.22, 0.45, 0.82, 1],
              ease: [0.25, 1, 0.5, 1], // Decelerating cubic-bezier curve
            }}
            className="fixed w-32 h-40 overflow-hidden border-2 border-[#6A0F1F] dark:border-[#e4e198] shadow-2xl bg-white dark:bg-black"
          >
            {productImg && (
              <Image
                src={productImg}
                alt=""
                className="w-full h-full object-cover object-top pointer-events-none select-none"
                draggable={false}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
