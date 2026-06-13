"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
// import ProductQuickView from "@/components/products/ProductQuickView";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";
import dynamic from "next/dynamic";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";

const ProductQuickView = dynamic(
  () => import("@/components/products/ProductQuickView"),
  {
    ssr: false,
  }
);

const ProductClient = ({ products }: { products: IMSProduct[] }) => {
  const { searchQuery, subCategory, priceRange, sizes } = useAppContext();

  const normalizedSub = normalize(subCategory);
  const normalizedSearch = searchQuery?.toLowerCase() || "";

  const normalizeSize = (size: string) =>
    size.replace(/\s+/g, " ").trim().toLowerCase();

  const normalizedSelectedSizes = useMemo(
    () => sizes.map(normalizeSize),
    [sizes],
  );

  useEffect(() => {
  const id = requestIdleCallback(() => {
    import("@/components/products/ProductQuickView");
  });

  return () => cancelIdleCallback(id);
}, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const subCategoryMatch =
        !normalizedSub || normalize(p.subcategory) === normalizedSub;

      const searchMatch =
        !normalizedSearch ||
        p.name.toLowerCase().includes(normalizedSearch) ||
        (p.description || "").toLowerCase().includes(normalizedSearch);

      const priceMatch =
        (priceRange.min === "" || p.price >= priceRange.min) &&
        (priceRange.max === "" || p.price <= priceRange.max);

      const sizeMatch =
        normalizedSelectedSizes.length === 0 ||
        p.variants?.[0]?.sizes?.some((productSize: string) =>
          normalizedSelectedSizes.includes(normalizeSize(productSize)),
        );

      return subCategoryMatch && searchMatch && priceMatch && sizeMatch;
    });
  }, [
    products,
    normalizedSub,
    normalizedSearch,
    priceRange.min,
    priceRange.max,
    normalizedSelectedSizes,
  ]);

  const groupedProducts = useMemo(() => {
    return Object.values(
      filteredProducts.reduce(
        (acc, product) => {
          const key = product.name.trim().toLowerCase();
          if (!acc[key]) acc[key] = product;
          return acc;
        },
        {} as Record<string, IMSProduct>,
      ),
    );
  }, [filteredProducts]);

  const resultCount = groupedProducts.length;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openProduct = useCallback((index: number) => {
  startTransition(() => {
    setSelectedIndex(index);
  });
}, []);

  const closeProduct = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const nextProduct = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % groupedProducts.length;
    });
  }, [groupedProducts.length]);

  const prevProduct = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? groupedProducts.length - 1 : prev - 1;
    });
  }, [groupedProducts.length]);

  if (groupedProducts.length === 0) {
    return (
      <EmptyState
        label="Collection Empty"
        title="We’re Still Stitching This One Together"
        description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
        buttonText="Browse All Products →"
        buttonLink="/"
      />
    );
  }

  return (
    <section className="w-full space-y-12">
      {/* RESULT HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.35em] text-[#957f6a]">
          {resultCount} {resultCount === 1 ? "Item" : "Items"}
        </p>

        {normalizedSub && (
          <p className="text-sm text-[#7a6a5c]">
            Filtered by{" "}
            <span className="font-medium capitalize text-[#5f5143]">
              {subCategory}
            </span>
          </p>
        )}
      </div>

      <div className="h-px bg-[#e6d8c8]" />

      {/* PRODUCT GRID */}
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
        {groupedProducts.map((item, index) => (
          <div
            key={`${item.productId}-${index}`}
            onClick={() => openProduct(index)}
            className="cursor-pointer"
          >
            <ProductCard Linked={false} product={item} />
          </div>
        ))}
      </div>
      <ProductQuickView
        product={selectedIndex !== null ? groupedProducts[selectedIndex] : null}
        isOpen={selectedIndex !== null}
        onClose={closeProduct}
        onNext={nextProduct}
        onPrev={prevProduct}
      />
    </section>
  );
};

export default ProductClient;
