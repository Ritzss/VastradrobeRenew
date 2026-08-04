/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
  useMemo,
  useEffect,
  startTransition,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";
import ProductCard from "@/components/Global/ProductCard";
import ProductStackMobile from "@/components/products/ProductQuickViewMobile";
import SideFilter from "../Global/SideFilter";
import EmptyState from "@/components/Global/EmptyState";

const ProductQuickView = dynamic(
  () => import("@/components/products/ProductQuickView"),
  { ssr: false },
);

type CollectionClientProps = {
  collection: {
    title: string;
    description: string;
    slug: string;
  };
  products: IMSProduct[];
};

/**
 * 👑 LUXURY COMPONENT: Collection Page Client (Nangalia Ruchira Theme)
 *
 * Re-architects collections page layouts:
 * - 🏛️ 2-COLUMN SPLIT LAYOUT: Permanent left-sidebar filter on desktop, sliding sheet on mobile.
 * - Spaced uppercase tracked typography & luxurious serif titles.
 * - Aligns perfectly with category lists for 100% storefront layout consistency!
 */
export default function CollectionClient({
  collection,
  products,
}: CollectionClientProps) {
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

  // Prefetch quick view modal
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

  return (
    <section className="w-full space-y-12 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 select-none">
      {/* 🏛️ Curated Picks collection title and header block */}
      <div className="text-center py-8">
        <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          Curated Showcase
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-3 leading-none">
          {collection.title}
        </h1>

        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-xs font-light font-sans tracking-wide leading-relaxed mt-5">
          {collection.description}
        </p>
      </div>

      {/* 🏛️ MINIMAL CATALOG HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 select-none">
        <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          {groupedProducts.length}{" "}
          {groupedProducts.length === 1 ? "Product" : "Products"} found
        </p>

        {/* Mobile-only minimalist filter link trigger */}
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6A0F1F] dark:text-[#e4e198] cursor-pointer"
        >
          <span>✦</span>
          <span>Filter & Sort</span>
        </button>
      </div>

      {showFilters && <SideFilter onClose={() => setShowFilters(false)} />}

      {products.length === 0 ? (
        <EmptyState
          label="Collection Empty"
          title="We’re Still Stitching This One Together"
          description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
          buttonText="Browse All Products →"
          buttonLink="/"
        />
      ) : (
        /* 🏛️ 2-COLUMN SPLIT LAYOUT: Permanent left-sidebar on desktop, slide-out banner drawer on mobile */
        <div className="flex flex-col md:flex-row gap-8 items-start w-full">
          {/* Left column: Docked sidebar filter (Desktop only) */}
          <SideFilter inline />

          {/* Right column: Product Grid (Scales dynamically on desktop and mobile) or Inline Empty State */}
          <div className="flex-1 w-full">
            {groupedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 w-full">
                {groupedProducts.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                  >
                    <ProductCard Linked={true} product={item} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950/20 shadow-xs max-w-xl mx-auto space-y-4">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  No matches
                </p>
                <h3 className="font-serif text-lg text-neutral-800 dark:text-white uppercase tracking-wide">
                  No Products Match Your Filters
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light max-w-xs mx-auto leading-relaxed">
                  Try adjusting your size, price, or clothing filters to
                  discover curated pieces.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop QuickView */}
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

      {/* Mobile QuickStack */}
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
}
