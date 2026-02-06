"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "../Global/ProductCard";
import { IMSProduct } from "@/Types/Product";

type Props = {
  products: IMSProduct[];
  category: string;
  title?: string;
};

const ScrollRevealProducts = ({ products, category, title }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productCategory =
      product.category ||
      "";

    return productCategory.toLowerCase() === category.toLowerCase();
  });

  if (filteredProducts.length === 0) return null;

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

      <div className="flex flex-wrap gap-4 justify-between">
        {filteredProducts.slice(0, 4).map((product) => (
          <div key={product.productId} className="w-[48%] md:w-[23%]">
            <ProductCard product={product} className="w-full" button={false}/>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollRevealProducts;
