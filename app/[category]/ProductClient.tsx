"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
// import Loading from "./loading";
import { IMSProduct } from "@/Types/Product";

const ProductClient = ({ products }: { products: IMSProduct[] }) => {
  const { searchQuery, subCategory, priceRange, sizes } = useAppContext();

  const normalizedSub = normalize(subCategory);
  const normalizeSize = (size: string) =>
  size.replace(/\s+/g, " ").trim().toLowerCase();
  const normalizedSearch = searchQuery?.toLowerCase() || "";
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
      p.sizes?.some((productSize: string) =>
        normalizedSelectedSizes.includes(normalizeSize(productSize)),
      );

    return subCategoryMatch && searchMatch && priceMatch && sizeMatch;
  });

  const groupedProducts = Object.values(
    filteredProducts.reduce(
      (acc, product) => {
        const key = product.name.trim().toLowerCase();
        if (!acc[key]) {
          acc[key] = product;
        }
        return acc;
      },
      {} as Record<string, IMSProduct>,
    ),
  );

  const resultCount = groupedProducts.length;

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
    <div className="md:w-[70vw] w-[95vw] h-[85vh] custom-scroll scrollbar-hide overflow-y-scroll mx-auto">
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
      <div className="flex justify-evenly flex-wrap">
        {groupedProducts.map((item) => (
          <ProductCard
            key={item.productId}
            product={item}
            height="h-[72vh] md:h-[60vh]"
            className="product-card border rounded-xl bg-white"
            classNameInner="h-[60vh] md:h-[49vh] mt-4 rounded-lg"
          />
        ))}
      </div>

      {/* <Loading /> */}
    </div>
  );
};

export default ProductClient;
