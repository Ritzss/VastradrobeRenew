"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "../Global/ProductCard";
import HorizontalScroll from "@/components/Global/HorizontalScroll";
import { IMSProduct } from "@/Types/Product";
import EmptyState from "../Global/EmptyState";

type Props = {
  products: IMSProduct[];
  category: string;
  title?: string;
};

const ScrollRevealProducts = ({ products, category, title }: Props) => {
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
  const filteredProducts = products.filter((product) => {
    const productCategory = product.category || "";
    return productCategory.toLowerCase() === category.toLowerCase();
  });

  if (filteredProducts.length === 0) return (
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
        <HorizontalScroll>
          {filteredProducts.slice(0, 6).map((product) => (
            <div
              key={product.productId}
              className="w-full sm:w-[60%] shrink-0"
            >
              <ProductCard
                product={product}
                className="w-full"
                button={false}
              />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* ---------- DESKTOP (wrap layout) ---------- */}
      <div className="hidden md:flex flex-wrap gap-3 justify-center">
        {filteredProducts.slice(0, 4).map((product) => (
          <div key={product.productId} className="md:w-[48%] lg:w-[23vw]">
            <ProductCard product={product} className="w-full" button={false} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollRevealProducts;
