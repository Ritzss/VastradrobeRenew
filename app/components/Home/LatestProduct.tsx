// /* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCardStatic from "@/components/Global/ProductCardStatic";
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

export default function LatestArrivals({ products }: LatestArrivalsProps,text: string) {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]["key"]>("women");

  const availableCategories = useMemo(() => {
    return categories.filter(({ key }) => {
      return products.some((product) => {
        const category = product.category.toLowerCase();
        // const subcategory = product.subcategory?.toLowerCase() ?? "";

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
      // const subcategory = product?.subcategory?.toLowerC///ase();

      switch (selectedCategory) {
        case "girls":
          return category === "girls" ;

        case "boys":
          return category === "boys" ;

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
      {/* Category Navigation */}
      <div className="flex items-center justify-center gap-8 mb-14">
        {availableCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`relative pb-2 text-sm uppercase tracking-[0.25em] transition-all duration-300 ${
              selectedCategory === category.key
                ? "text-[#5f5143]"
                : "text-[#a89784] hover:text-[#5f5143]"
            }`}
          >
            {category.label}

            <span
              className={`absolute left-0 bottom-0 h-0.5 bg-[#5f5143] transition-all duration-300 ${
                selectedCategory === category.key
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              }`}
            />
          </button>
        ))}
      </div>

      <section className="relative w-full">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-[#fffaf6] to-transparent" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-[#fffaf6] to-transparent" />

        {filteredProducts.length > 3 ? (
          <InfiniteScrollWrapper key={selectedCategory}>
            {filteredProducts.map((product) => (
              <div key={product.productId} className="w-55 md:w-72 shrink-0 px-1">
                <ProductCardStatic latest text={text} product={product} />
              </div>
            ))}
          </InfiniteScrollWrapper>
        ) : (
          <div className="flex justify-center">
            <HorizontalScroll color="#f9f5ef">
            {filteredProducts.map((product) => (
              <div key={product.productId} className="w-55 md:w-72 shrink-0 px-1">
                <ProductCardStatic className="" latest text={text} product={product} />
              </div>
            ))}
            </HorizontalScroll>
          </div>
        )}
      </section>
    </>
  );
}
