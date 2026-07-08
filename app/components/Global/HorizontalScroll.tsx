"use client";

import { useRef, useEffect, useState } from "react";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
  color?:string;
  customclass?:string;
};

const HorizontalScroll = ({ children, className, color, customclass }: HorizontalScrollProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  /* ---------- fade edges ---------- */
  const updateFades = () => {
    const slider = sliderRef.current;
    const wrapper = wrapperRef.current;
    if (!slider || !wrapper) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;

    wrapper.classList.toggle("show-left", scrollLeft > 0);
    wrapper.classList.toggle(
      "show-right",
      scrollLeft + clientWidth < scrollWidth - 1,
    );
  };

  /* ---------- subtle nudge (once) ---------- */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateFades();

    slider.scrollBy({ left: 40, behavior: "smooth" });
    const t = setTimeout(
      () => slider.scrollBy({ left: -40, behavior: "smooth" }),
      400,
    );

    return () => clearTimeout(t);
  }, []);

  /* ---------- drag handlers ---------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    setIsDragging(true);
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div ref={wrapperRef} className={`latest-slider-wrapper relative mx-auto md:w-full ${color} ${customclass ?? ""} w-[20rem]`}>
      <div
        ref={sliderRef}
        onScroll={updateFades}
        onMouseDown={onMouseDown}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onMouseMove={onMouseMove}
        className={`flex overflow-x-auto overflow-y-hidden touch-pan-x select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${className ?? ""} gap-3`}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
