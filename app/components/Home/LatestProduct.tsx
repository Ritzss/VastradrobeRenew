"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import InfiniteScroll from "./InfiniteScroll";

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

    {isVisible && (
      <InfiniteScroll>
        {products.map((product) => (
          <div key={product.productId} className="w-75 shrink-0">
            <ProductCard
              product={product}
              className="w-[99%]"
              height="h-[50vh]"
              classNameInner="h-[47vh] w-full rounded-2xl"
              button={false}
            />
          </div>
        ))}
      </InfiniteScroll>
    )}
  </section>
);
};

export default LatestArrivals;
