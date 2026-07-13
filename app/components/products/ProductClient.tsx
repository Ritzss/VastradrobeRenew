/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
import ProductStackMobile from "@/components/products/ProductQuickViewMobile";
// import ProductStack from "@/components/products/ProductQuickViewMobile";
// import ProductQuickView from "@/components/products/ProductQuickView";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CategoryHero from "../category/CategoryHero";
import CategoryTabs from "../category/CategoryTabs";
import FeaturedCollection from "../category/FeaturedCollection";
import TrustSection from "../category/TrustSection";
import ProductToolbar from "../category/ProductToolbar";
import SideFilter from "../Global/SideFilter";

const ProductQuickView = dynamic(
  () => import("@/components/products/ProductQuickView"),
  {
    ssr: false,
  },
);

const ProductClient = ({
  products,
  category,
}: {
  products: IMSProduct[];
  category: "all" | "women" | "men" | "kids";
}) => {
  const { searchQuery, subCategory, priceRange, sizes, sortBy } =
    useAppContext();
  const [showFilters, setShowFilters] = useState(false);
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
    const grouped = Object.values(
      filteredProducts.reduce(
        (acc, product) => {
          const key = product.name.trim().toLowerCase();

          if (!acc[key]) acc[key] = product;

          return acc;
        },
        {} as Record<string, IMSProduct>,
      ),
    );

    switch (sortBy) {
      case "price-low":
        grouped.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        grouped.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        grouped.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        grouped.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "newest":
        grouped.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;

      default:
        break;
    }

    return grouped;
  }, [filteredProducts, sortBy]);

  // const resultCount = groupedProducts.length;

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
    <section id="categoryPage" className="w-full space-y-12">
      {/* RESULT HEADER */}
      {/* <div className="flex items-center justify-between">
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
      </div> */}

      <CategoryHero category={category} />

      <CategoryTabs current={category} />

      <FeaturedCollection products={groupedProducts} category={category} />

      <TrustSection />

      <ProductToolbar
        count={groupedProducts.length}
        onFilter={() => setShowFilters(true)}
      />

      {showFilters && <SideFilter onClose={() => setShowFilters(false)} />}

      {/* <div className="h-px bg-[#e6d8c8]" /> */}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-14">
        {groupedProducts.map((item, index) => (
          <motion.div
            key={`${item.productId}-${index}`}
            onClick={() => openProduct(index)}
            className="cursor-pointer"
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.04,
            }}
          >
            <ProductCard Linked={false} product={item} />
          </motion.div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <ProductQuickView
          product={
            selectedIndex !== null ? groupedProducts[selectedIndex] : null
          }
          isOpen={selectedIndex !== null}
          onClose={closeProduct}
          onNext={nextProduct}
          onPrev={prevProduct}
          inventory={[]}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <ProductStackMobile
          products={groupedProducts}
          selectedProduct={
            selectedIndex !== null ? groupedProducts[selectedIndex] : null
          }
          isOpen={selectedIndex !== null}
          onClose={closeProduct}
        />
      </div>
    </section>
  );
};

export default ProductClient;
