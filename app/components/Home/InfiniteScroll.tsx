"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

const SPEED = 40; // lower = slower (luxury vibe)

const InfiniteScroll = ({ children }: { children: ReactNode }) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
    <div className="overflow-hidden w-full">
      <motion.div
        ref={containerRef}
        className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
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
