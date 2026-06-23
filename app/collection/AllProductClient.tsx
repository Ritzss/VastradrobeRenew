"use client";

import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  initialProducts: IMSProduct[];
  pageSize: number;
};

const AllProductClient = ({ initialProducts, pageSize }: Props) => {
  const [products, setProducts] = useState<IMSProduct[]>(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?page=${page}&limit=${pageSize}`,
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      const newProducts = data.products || [];

      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prev) => prev + 1);

      if (newProducts.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "200px" }, // smoother preload
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore]);

  const groupedProducts = Object.values(
    products.reduce(
      (acc, product) => {
        const key = product.name.trim().toLowerCase();
        if (!acc[key]) acc[key] = product;
        return acc;
      },
      {} as Record<string, IMSProduct>,
    ),
  );

  return (
    <section className="w-full pt-28 px-12 bg-[#f9f5ef]">
      <h1 className="sr-only">All Fashion Products | VastraDrobe</h1>
      <div className="flex flex-col justify-center items-center">
        <h1 className="mb-3 text-4xl md:text-5xl font-light tracking-tight text-[#5f5143]">
        Curated for Every Occasion
      </h1>

      <p className="mb-10 max-w-3xl text-center leading-7 text-[#7a6a5c]">
        Browse our complete collection of contemporary fashion, from effortless
        everyday wear to standout statement pieces. Find styles that move with
        you, wherever the day takes you.
      </p>
      </div>

      {/* Count */}
      <div className="mb-10 text-sm text-[#7a6a5c]">
        Showing {groupedProducts.length} products
      </div>

      {/* GRID */}
      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-8
        lg:gap-10
      "
      >
        {groupedProducts.map((item, index) => (
          <ProductCard
            key={`${item.productId}-${index}`}
            product={item}
            Linked
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-20 flex items-center justify-center"
        >
          {loading && (
            <div className="text-sm text-[#957f6a] animate-pulse">
              Loading more products…
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AllProductClient;
