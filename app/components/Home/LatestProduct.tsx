"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import Link from "next/link";
import HorizontalScroll from "../Global/HorizontalScroll";

type LatestArrivalsProps = {
  products: IMSProduct[];
};

const LatestArrivals = ({ products }: LatestArrivalsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* reveal once */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section ref={sectionRef} className="w-full px-4 md:px-8 mt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/product" className="flex items-center gap-3">
          <h2 className="text-[2rem] text-[#2B2B2B] font-semibold">
            Latest Arrivals
          </h2>
          <span className="text-md border px-2 py-1 rounded-full">
            New
          </span>
        </Link>
      </div>

      {isVisible && (
        <HorizontalScroll>
          {products.map((product) => (
            <div key={product.productId} className="w-85 shrink-0">
              <ProductCard
                product={product}
                className="w-[99%]"
                button={false}
              />
            </div>
          ))}
        </HorizontalScroll>
      )}
    </section>
  );
};

export default LatestArrivals;
