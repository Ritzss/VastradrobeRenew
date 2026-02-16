"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";

const ProductClient = ({ products }: { products: IMSProduct[] }) => {
  const { searchQuery, subCategory } = useAppContext();

  const normalizedSub = normalize(subCategory);
  const normalizedSearch = searchQuery?.toLowerCase() || "";

  const filteredProducts = products.filter((p) => {
    const subCategoryMatch =
      !normalizedSub || normalize(p.subcategory) === normalizedSub;

    const searchMatch =
      !normalizedSearch ||
      p.name.toLowerCase().includes(normalizedSearch) ||
      (p.description || "").toLowerCase().includes(normalizedSearch);

    return subCategoryMatch && searchMatch;
  });

  const groupedProducts = Object.values(
  filteredProducts.reduce((acc, product) => {
    const key = product.name.trim().toLowerCase();
    if (!acc[key]) {
      acc[key] = product;
    }
    return acc;
  }, {} as Record<string, IMSProduct>)
);

  const resultCount = filteredProducts.length;

  if (groupedProducts.length === 0) {
    return (
      <EmptyState
        label={`Collection's Empty`}
        title="We’re Still Stitching This One Together"
        description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
        buttonText="Browse All Products →"
        buttonLink="/"
      />
    );
  }

  return (
    <div className="md:w-[76vw] lg:w-[76vw] w-[95vw] mx-auto">
      {/* RESULTS HEADER */}
      <div className="flex items-center justify-between mt-10 px-4">
        <p className="text-sm text-gray-500 uppercase tracking-[0.25em]">
          {resultCount} {resultCount === 1 ? "Item" : "Items"}
        </p>

        {normalizedSub && (
          <p className="text-sm text-gray-600">
            Filtered by{" "}
            <span className="font-medium capitalize">{subCategory}</span>
          </p>
        )}
      </div>

      <div className="h-px bg-gray-200 mb-12" />

      {/* PRODUCT GRID */}
      <div className="flex flex-wrap gap-5">
        {groupedProducts.map((item) => (
          <ProductCard
            key={item.productId}
            product={item}
            className="product-card border bg-white"
            classNameInner="h-[45vh] rounded-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductClient;
