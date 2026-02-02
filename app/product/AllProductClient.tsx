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
  const [page, setPage] = useState(2); // page 1 already loaded
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
  if (loading || !hasMore) return;

  setLoading(true);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?page=${page}&limit=${pageSize}`,
      { cache: "no-store" }
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
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <section className="w-full px-4">
      <div className="m-4 text-xl text-gray-600">
        Showing {products.length} products
      </div>

      <div className="flex flex-wrap justify-evenly gap-3">
        {products.map((item,index) => (
          <ProductCard
            key={`${item.productId}-${index}`} product={item}/>
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerRef}
          className="h-12 flex items-center justify-center"
        >
          {loading && (
            <span className="m-4 text-xl text-gray-500">Loading more…</span>
          )}
        </div>
      )}
    </section>
  );
};

export default AllProductClient;
