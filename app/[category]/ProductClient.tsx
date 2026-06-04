"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
import ProductQuickView from "@/components/products/ProductQuickView";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";
import { useState } from "react";

const ProductClient = ({ products }: { products: IMSProduct[] }) => {
  const { searchQuery, subCategory, priceRange, sizes } = useAppContext();

  const normalizedSub = normalize(subCategory);
  const normalizedSearch = searchQuery?.toLowerCase() || "";

  const normalizeSize = (size: string) =>
    size.replace(/\s+/g, " ").trim().toLowerCase();

  const normalizedSelectedSizes = sizes.map(normalizeSize);

  const filteredProducts = products.filter((p) => {
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

  const groupedProducts = Object.values(
    filteredProducts.reduce(
      (acc, product) => {
        const key = product.name.trim().toLowerCase();
        if (!acc[key]) acc[key] = product;
        return acc;
      },
      {} as Record<string, IMSProduct>,
    ),
  );

  const resultCount = groupedProducts.length;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openProduct = (index: number) => setSelectedIndex(index);

  const closeProduct = () => setSelectedIndex(null);

  const nextProduct = () => {
    if (selectedIndex === null) return;

    setSelectedIndex((selectedIndex + 1) % groupedProducts.length);
  };

  const prevProduct = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? groupedProducts.length - 1 : selectedIndex - 1,
    );
  };

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
            <ProductCard product={item} />
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
