"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect } from "react";

const InfiniteScroll = ({ children }: { children: ReactNode }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    });
  }, [controls]);

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        onDragStart={() => controls.stop()}
        onDragEnd={() => {
          controls.start({
            x: ["0%", "-50%"],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            },
          });
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;
