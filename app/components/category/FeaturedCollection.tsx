"use client";

import { IMSProduct } from "@/Types/Product";
import ProductCard from "@/components/Global/ProductCard";
import Link from "next/link";

interface Props {
  products: IMSProduct[];
  category: string;
}

export default function FeaturedCollection({
  products,
  category,
}: Props) {
  const featured = products.slice(0, 5);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
            Featured Collection
          </p>

          <h2 className="mt-3 text-4xl font-light text-[#5f5143]">
            Trending Right Now
          </h2>

          <p className="mt-2 text-[#8c7a69]">
            Our favourite pieces from this collection.
          </p>
        </div>

        <Link
          href={`/${category}`}
          className="hidden md:block text-sm text-[#5f5143] hover:underline"
        >
          View Collection →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {featured.map((product) => (
          <ProductCard
            key={product.productId}
            Linked
            product={product}
          />
        ))}
      </div>
    </section>
  );
}