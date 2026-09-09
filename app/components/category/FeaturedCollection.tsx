"use client";

import { IMSProduct } from "@/Types/Product";
import ProductCard from "@/components/Global/ProductCard";
import Link from "next/link";

interface Props {
  products: IMSProduct[];
  category: string;
}

/**
 * 👑 LUXURY REDESIGN: Featured Collection Showcase (Nangalia Ruchira Theme)
 *
 * Re-designed with pristine styling:
 * - Removed all legacy brown color selectors and replaced with a clean, high-fashion layout.
 * - Bold tracked uppercase metadata subtitle.
 * - Elegant serif header.
 * - View All Link styled as a modern uppercase tracked transition link.
 */
export default function FeaturedCollection({ products, category }: Props) {
  // Extract up to 5 items to showcase
  const featured = products.slice(0, 5);

  if (featured.length === 0) return null;

  return (
    <section className="space-y-10 select-none">
      {/* HEADER BLOCK */}
      <div className="flex items-end justify-between border-b border-neutral-100 dark:border-neutral-900 pb-5">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Curated Showcase
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-none">
            Trending Right Now
          </h2>

          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light font-sans tracking-wide">
            Our favourite hand-picked silhouettes from this collection.
          </p>
        </div>

        <Link
          href={`/${category}`}
          className="hidden md:inline-flex text-[10px] tracking-widest font-bold uppercase text-[#6A0F1F] dark:text-[#e4e198] hover:underline underline-offset-4 transition"
        >
          View Full Series →
        </Link>
      </div>

      {/* 5-COLUMN EDITORIAL GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {featured.map((product) => (
          <ProductCard
            key={product.productId}
            Linked={true}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}
