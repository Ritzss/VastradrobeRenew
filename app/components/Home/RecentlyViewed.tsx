/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCardStatic from "@/components/Global/ProductCardStatic";
import InfiniteScrollWrapper from "@/components/Global/InfiniteScrollWrapper";
import { IMSProduct } from "@/Types/Product";

type Props = {
  products: IMSProduct[];
};

export default function RecentlyViewed({ products }: Props) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    if (stored.length > 0) {
      setIds(stored);
    }
  }, []);

  const recentProducts = useMemo(() => {
    return ids
      .map((id) => products.find((p) => p.productId === id))
      .filter(Boolean) as IMSProduct[];
  }, [ids, products]);

  if (recentProducts.length < 2) return null;

  return (
    <section className="py-8  dark:bg-black bg-[#fffaf6]">
      <div className="w-full mx-auto">

        <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-3 text-center">
          Continue Exploring
        </p>

        <h2 className="text-4xl md:text-5xl font-semibold text-[#5f5143] text-center mb-6">
          Recently Viewed
        </h2>

        <p className="text-[#957f6a] text-center max-w-xl mx-auto mb-10">
          Pick up right where you left off.
        </p>

        <div className="relative">

          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r dark:from-black from-[#fffaf6] to-transparent" />

          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l dark:from-black from-[#fffaf6] to-transparent" />

          {recentProducts.length > 3 ? (
            <InfiniteScrollWrapper>
              {recentProducts.map((product) => (
                <div
                  key={product.productId}
                  className="w-55 md:w-72 shrink-0 px-1"
                >
                  <ProductCardStatic product={product} text={""} />
                </div>
              ))}
            </InfiniteScrollWrapper>
          ) : (
            <div className="flex justify-center">
              {recentProducts.map((product) => (
                <div
                  key={product.productId}
                  className="w-55 md:w-72 px-1"
                >
                  <ProductCardStatic product={product} text={""} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}