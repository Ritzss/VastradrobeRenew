/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/Global/ProductCard";
import InfiniteScrollWrapper from "@/components/Global/InfiniteScrollWrapper";
import { IMSProduct } from "@/Types/Product";

type Props = {
  products: IMSProduct[];
};

/**
 * 👑 LUXURY REDESIGN: Recently Viewed (Nangalia Ruchira Theme)
 *
 * Centralized components:
 * - Replaced legacy duplicate "ProductCardStatic" imports with our unified central "ProductCard"!
 */
export default function RecentlyViewed({ products }: Props) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

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
    <section className="py-16 bg-[#fcfbfa] dark:bg-black border-t border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="w-full mx-auto">
        {/* HEADER BLOCK */}
        <div className="text-center mb-12 space-y-1">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Continue Exploring
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
            Recently Viewed
          </h2>

          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-xs font-light font-sans tracking-wide">
            Pick up right where you left off.
          </p>
        </div>

        <div className="relative">
          {/* Fades */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r dark:from-black from-[#fcfbfa] to-transparent" />

          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l dark:from-black from-[#fcfbfa] to-transparent" />

          {recentProducts.length > 3 ? (
            <InfiniteScrollWrapper>
              {recentProducts.map((product) => (
                <div
                  key={product.productId}
                  className="w-55 md:w-72 shrink-0 px-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </InfiniteScrollWrapper>
          ) : (
            <div className="flex justify-center gap-4">
              {recentProducts.map((product) => (
                <div key={product.productId} className="w-55 md:w-72 px-1">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
