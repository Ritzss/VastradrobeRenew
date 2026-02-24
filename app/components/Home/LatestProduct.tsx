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
              className="w-[99%] md:hover:scale-102 md:hover:shadow-[0_0_10px] active:scale-102 active:shadow-[0_0_10px] duration-700 transition-all"
              height="h-[60vh]"
              classNameInner="h-[53vh] w-full rounded-2xl"
              button={false}
            >
              <div className="uppercase text-center m-2 w-full ">
                {product.name}
              </div>
            </ProductCard>
          </div>
        ))}
      </InfiniteScroll>
    )}
  </section>
);
};

export default LatestArrivals;
