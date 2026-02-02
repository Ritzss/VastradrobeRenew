"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import Link from "next/link";

type LatestArrivalsProps = {
  products: IMSProduct[];
};

const LatestArrivals = ({ products }: LatestArrivalsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // drag state (mutable, no re-renders)
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [isVisible, setIsVisible] = useState(false);

  /* ---------- run only when section enters viewport ---------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ---------- subtle nudge (once, when visible) ---------- */
  useEffect(() => {
    if (!isVisible || !products || products.length === 0) return;

    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({ left: 40, behavior: "smooth" });
    const t = setTimeout(() => {
      slider.scrollBy({ left: -40, behavior: "smooth" });
    }, 400);

    return () => clearTimeout(t);
  }, [isVisible, products]);

  if (!products || products.length === 0) return null;

  /* ---------- drag handlers ---------- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section ref={sectionRef} className="w-full px-4 md:px-8 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href={"/product"} className="flex items-center gap-3">
            <h2 className="text-[2rem] text-[#2B2B2B] font-semibold">
              Latest Arrivals
            </h2>
            <span className="text-md hover:bg-[#fffa00] hover:text-white text-[#2B2B2B] border px-2 py-1 rounded-full">
              New
            </span>
          </Link>
        </div>
        <span className="text-sm text-gray-500">Drag to explore →</span>
      </div>
      <div className="relative">
        <div className="latest-slider-wrapper">
          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto cursor-grab select-none"
            onMouseDown={onMouseDown}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onMouseMove={onMouseMove}
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => (
              <div key={product.productId} className="w-85 shrink-0">
                <ProductCard product={product} className="w-[99%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArrivals;
