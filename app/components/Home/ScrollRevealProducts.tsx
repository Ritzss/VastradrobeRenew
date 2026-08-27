"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { IMSProduct } from "@/Types/Product";
import EmptyState from "../Global/EmptyState";
import Link from "next/link";
import ScrollReveal from "../Global/ScrollReveal";
import ProductCard from "../Global/ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

type Props = {
  products: IMSProduct[];
  category: string;
  title?: string;
  text?: string;
  color?: string;
};

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
  ethnic: ["ethnic"],
};

/**
 * 👑 LUXURY REDESIGN: Category Showcase (Nangalia Ruchira Theme)
 *
 * Sizing & Layout Refined:
 * - 📱 MOBILE & TABLET VIEW (< 1024px): Fully interactive, touch-friendly Swiper Carousel with free-mode swipe inertia.
 * - 🖥️ DESKTOP VIEW (>= 1024px): Classic centered geometric layout displaying exactly 3 key items.
 * - Slices list at 10 items instead of 3 on mobile/tablet so visitors can fully swipe through the collection.
 */
export default function ScrollRevealProducts({
  products,
  category,
  // color,
}: Props) {
  const normalizedCategory = category.toLowerCase();
  const categoryFilters = CATEGORY_MAP[normalizedCategory] || [
    normalizedCategory,
  ];

  const filteredProducts = products.filter((product) =>
    categoryFilters.includes(product.category?.toLowerCase() || ""),
  );

  if (filteredProducts.length === 0)
    return (
      <EmptyState
        title="We’re Still Stitching This One Together"
        description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
        buttonText="Browse All Products →"
        buttonLink="/"
      />
    );

  return (
    <section className="relative w-full px-0 mx-0">
      {/* ================= 📱 MOBILE & TABLET VIEW: Premium Swiper Carousel (< 1024px) ================= */}
      <div className="lg:hidden w-full px-0 mx-0 select-none">
        <Swiper
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={16}
          slidesOffsetBefore={24}
          slidesOffsetAfter={24}
          className="w-full"
        >
          {filteredProducts.slice(0, 10).map((product) => (
            <SwiperSlide
              key={product.productId}
              className="w-[45vw] sm:w-[35vw] md:w-72 shrink-0 px-1"
            >
              <ProductCard product={product}  />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center mt-12">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="text-[10px] tracking-widest font-bold uppercase px-8 py-3.5 rounded-full border border-[#5f5143] text-[#5f5143] dark:border-neutral-700 dark:text-neutral-300 hover:bg-[#5f5143] hover:text-white dark:hover:bg-neutral-800 transition duration-300"
          >
            browse all {category}
          </Link>
        </div>
      </div>

      {/* ================= 🖥️ DESKTOP VIEW: High-End centered flex layout (>= 1024px) ================= */}
      <div className="hidden lg:flex justify-center gap-1 select-none">
        {filteredProducts.slice(0, 3).map((product) => (
          <ScrollReveal key={product.productId}>
            <div className="w-70">
              <ProductCard product={product}   />
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Desktop Button */}
      <div className="hidden lg:flex justify-center mt-8">
        <Link
          href={`/${encodeURIComponent(category.toLowerCase())}#categoryPage`}
          className="px-10 py-3.5 rounded-full border border-[#5f5143] text-[#5f5143] dark:border-neutral-700 dark:text-neutral-300 hover:bg-[#5f5143] hover:text-white dark:hover:bg-neutral-800 text-xs font-semibold uppercase tracking-widest transition duration-300"
        >
          Browse All {category}
        </Link>
      </div>
    </section>
  );
}
