"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "../Global/ProductCard";
import HorizontalScroll from "@/components/Global/HorizontalScroll";
import { IMSProduct } from "@/Types/Product";
import EmptyState from "../Global/EmptyState";
import Link from "next/link";

type Props = {
  products: IMSProduct[];
  category: string;
  title?: string;
  color?: string;
};

const ScrollRevealProducts = ({ products, category, title, color }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  /* scroll reveal (in + out) */
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  /* category filter */
  const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
  ethnic: ["ethnic"],
};

const normalizedCategory = category.toLowerCase();

const categoryFilters =
  CATEGORY_MAP[normalizedCategory] || [normalizedCategory];

const filteredProducts = products.filter((product) =>
  categoryFilters.includes(product.category?.toLowerCase() || "")
);


  if (filteredProducts.length === 0)
    return (
      <EmptyState
        // label={`${category} Collection`}
        title="We’re Still Stitching This One Together"
        description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
        buttonText="Browse All Products →"
        buttonLink="/"
      />
    );

  return (
    <section
      ref={ref}
      className={`max-w-8xl mx-auto my-18 px-2 transition-all duration-700 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {title ?? `Explore ${category}`}
      </h2>

      {/* ---------- MOBILE (horizontal scroll) ---------- */}
      <div className="md:hidden">
        <HorizontalScroll color={color}>
          {filteredProducts.slice(0, 3).map((product) => (
            <div key={product.productId} className="w-full sm:w-[60%] shrink-0">
              <ProductCard
                product={product}
                className="md:w-[95%] group w-full hover:scale-102 hover:shadow-[0_0_10px] duration-700 transition-all"
                height="h-[55vh]"
                classNameInner="h-[47vh] rounded-2xl"
                button={false}
              >
              <div className="uppercase text-center m-2 w-full ">
                {product.name} <span className="hidden group-hover:block">{` (${product.color})`}</span>
              </div>
            </ProductCard>
            </div>
          ))}
        </HorizontalScroll>

        <div className="flex justify-center mt-6">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="group inline-block border border-black px-8 py-3 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300"
          >
            <span className="inline-flex items-center gap-2">
              Browse All {category.toUpperCase()}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* ---------- DESKTOP (wrap layout) ---------- */}
      <div className="hidden md:flex flex-wrap justify-center">
        {filteredProducts.slice(0, 3).map((product) => (
          <div key={product.productId} className="md:w-[48%] lg:w-[23vw]">
            <ProductCard
              product={product}
              height="h-[60vh]"
              classNameInner="h-[47vh] rounded-2xl"
              className="md:w-[95%] group w-[85%] hover:scale-102 hover:shadow-[0_0_10px] duration-700 transition-all"
              button={false}
            >
              <div className="uppercase text-center m-2 w-full ">
                {product.name} <span className="hidden group-hover:block">{` (${product.color})`}</span>
              </div>
            </ProductCard>
          </div>
        ))}

        <div className="w-full flex justify-center mt-6">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="group border border-black px-8 py-3 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300"
          >
            <span className="inline-flex items-center gap-2">
              Browse All {category.toUpperCase()}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ScrollRevealProducts;
