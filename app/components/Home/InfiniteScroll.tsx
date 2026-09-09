"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { ReactNode, useRef, useState, useEffect } from "react";

const SPEED = 40; // lower = slower (luxury vibe)

const InfiniteScroll = ({ children }: { children: ReactNode }) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  useAnimationFrame((_, delta) => {
    if (isDragging) return;

    const moveBy = (delta / 1000) * SPEED;
    x.set(x.get() - moveBy);

    const container = containerRef.current;
    if (!container) return;

    const width = container.scrollWidth / 2;

    if (Math.abs(x.get()) >= width) {
      x.set(0);
    }
  });

  return (
    <div className="overflow-x-hidden w-full touch-pan-y">
      <motion.div
        ref={containerRef}
        className="flex w-max cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ x }}
        drag={isTouch ? false : "x"}
        dragConstraints={{ left: -10000, right: 10000 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;
