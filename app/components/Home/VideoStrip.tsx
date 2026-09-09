"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VideoItem = {
  id: string;
  videoUrl: string;
};

export default function VideoStrip({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // ESC closes
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <div className="relative mx-auto px-6">
        <div className="flex gap-2 overflow-x-auto md:overflow-visible md:justify-center">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              layoutId={video.videoUrl}
              onClick={() => setActiveVideo(video.videoUrl)}
              className=" relative min-w-70 md:min-w-90 h-160 rounded-4xl overflow-hidden shadow-[0_30px_80px_rgba(149,127,106,0.18)] bg-neutral-950 cursor-pointer"
            >
              <video
                src={video.videoUrl}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[#5f5143] text-lg">
                  ▶
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <>
            {/* Background Fade */}
            <motion.div
              className="fixed inset-0 bg-neutral-950/90 backdrop-blur-sm z-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
            />

            {/* Expanding Video */}
            <motion.div
              layoutId={activeVideo}
              className="fixed inset-0 z-101 flex items-center justify-center p-6"
              onClick={() => setActiveVideo(null)}
            >
              <motion.video
                src={activeVideo}
                autoPlay
                controls
                className="w-full max-w-6xl max-h-[90vh] object-contain rounded-2xl bg-neutral-950"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
