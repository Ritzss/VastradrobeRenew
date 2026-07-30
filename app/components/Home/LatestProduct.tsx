// /* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import InfiniteScrollWrapper from "../Global/InfiniteScrollWrapper";
import HorizontalScroll from "../Global/HorizontalScroll";

type LatestArrivalsProps = {
  products: IMSProduct[];
};

const categories = [
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "girls", label: "Girls" },
  { key: "boys", label: "Boys" },
] as const;

/**
 * 👑 LUXURY REDESIGN: Latest Arrivals Grid Navigator (Nangalia Ruchira Theme)
 *
 * Centralized components:
 * - Replaced legacy duplicate "ProductCardStatic" imports with our unified central "ProductCard"!
 */
export default function LatestArrivals(
  { products }: LatestArrivalsProps,
  text: string,
) {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]["key"]>("women");

  const availableCategories = useMemo(() => {
    return categories.filter(({ key }) => {
      return products.some((product) => {
        const category = product.category.toLowerCase();

        switch (key) {
          case "girls":
            return category === "girls";
          case "boys":
            return category === "boys";
          default:
            return category === key;
        }
      });
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const category = product.category.toLowerCase();

      switch (selectedCategory) {
        case "girls":
          return category === "girls";
        case "boys":
          return category === "boys";
        default:
          return category === selectedCategory;
      }
    });
  }, [products, selectedCategory]);

  useEffect(() => {
    if (!availableCategories.some((c) => c.key === selectedCategory)) {
      setSelectedCategory(availableCategories[0]?.key ?? "women");
    }
  }, [availableCategories, selectedCategory]);

  if (!products.length) return null;

  return (
    <>
      {/* Category Navigation (Elegant tracked links) */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 mb-12 border-b border-neutral-100 dark:border-neutral-900 pb-3 max-w-lg mx-auto">
        {availableCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`relative pb-3 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer ${
              selectedCategory === category.key
                ? "text-[#6A0F1F] dark:text-[#e4e198]"
                : "text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
            }`}
          >
            {category.label}

            <span
              className={`absolute left-0 bottom-0 h-0.5 bg-[#6A0F1F] dark:bg-[#e4e198] transition-all duration-300 ${
                selectedCategory === category.key
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </button>
        ))}
      </div>

      <section className="relative w-full">
        {filteredProducts.length > 3 ? (
          <InfiniteScrollWrapper key={selectedCategory}>
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                className="w-[45vw] md:w-72 shrink-0 px-1"
              >
                <ProductCard latest product={product} />
              </div>
            ))}
          </InfiniteScrollWrapper>
        ) : (
          <div className="flex justify-center">
            <HorizontalScroll className="md:justify-center" color="#fcfbfa">
              {filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  className="w-[45vw] md:w-72 shrink-0 px-1"
                >
                  <ProductCard latest product={product} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        )}
      </section>
    </>
  );
}
