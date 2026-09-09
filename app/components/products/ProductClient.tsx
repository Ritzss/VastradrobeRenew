"use client";

import EmptyState from "@/components/Global/EmptyState";
import ProductCard from "@/components/Global/ProductCard";
// import ProductStackMobile from "@/components/products/ProductQuickViewMobile";
// import ProductStack from "@/components/products/ProductQuickViewMobile";
// import ProductQuickView from "@/components/products/ProductQuickView";
import { useAppContext } from "@/hooks/useAppContext";
import { IMSProduct } from "@/Types/Product";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CategoryHero from "../category/CategoryHero";
import CategoryTabs from "../category/CategoryTabs";
import TrustSection from "../category/TrustSection";
import SideFilter from "../Global/SideFilter";

type ProductClientProps = {
  products: IMSProduct[];
  category?: "all" | "women" | "men" | "kids";
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};

const PRODUCTS_PER_PAGE = 12;

const ProductClient = ({
  products: initialProducts,
  category = "all",
}: ProductClientProps) => {
  const {
    searchQuery,
    subCategory,
    priceRange,
    sizes,
    sortBy,
    selectedCategory,
  } = useAppContext();

  const [showFilters, setShowFilters] = useState(false);

  /*
   * Products currently loaded into the page.
   *
   * We append new API results to this array when the user
   * reaches the bottom of the product grid.
   */
  const [products, setProducts] =
    useState<IMSProduct[]>(initialProducts);

  /*
   * Pagination state returned by the IMS API.
   */
  const [pagination, setPagination] =
    useState<PaginationData>({
      page: 1,
      limit: PRODUCTS_PER_PAGE,
      total: initialProducts.length,
      hasNextPage: true,
    });

  /*
   * Prevents multiple IntersectionObserver calls from
   * firing multiple API requests at the same time.
   */
  const [loadingMore, setLoadingMore] = useState(false);

  /*
   * Used when filters/sorting change and we need to fetch
   * a completely new product collection from page 1.
   */
  const [loadingFiltered, setLoadingFiltered] =
    useState(false);

  /*
   * Sentinel element placed underneath the product grid.
   * When it enters the viewport, the next page is loaded.
   */
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /*
   * Keeps track of the latest filter request.
   *
   * If a user changes filters quickly, an older request
   * should not overwrite the newer result.
   */
  const requestIdRef = useRef(0);

  /*
   * Category used for the current page.
   *
   * If the global category selector is empty, fall back
   * to the category from the URL.
   */
  const activeCategory =
    selectedCategory?.trim() || category;

  /*
   * Build the category value expected by the API.
   *
   * Kids contains both boys and girls.
   * "all" intentionally sends no category filter.
   */
  const categoryParam = useMemo(() => {
    switch (activeCategory.toLowerCase()) {
      case "kids":
        return "boys,girls";

      case "men":
        return "men";

      case "women":
        return "women";

      case "all":
      default:
        return "";
    }
  }, [activeCategory]);

  /*
   * Creates the query string used by the IMS products API.
   *
   * All filtering and sorting now happens on the server/database.
   * The browser therefore receives only the products it needs.
   */
  const buildProductsQuery = useCallback(
    (page: number) => {
      const params = new URLSearchParams();

      if (categoryParam) {
        params.set("category", categoryParam);
      }

      if (subCategory?.trim()) {
        params.set("subcategory", subCategory.trim());
      }

      if (searchQuery?.trim()) {
        params.set("search", searchQuery.trim());
      }

      if (priceRange.min !== "") {
        params.set("minPrice", String(priceRange.min));
      }

      if (priceRange.max !== "") {
        params.set("maxPrice", String(priceRange.max));
      }

      /*
       * The API currently accepts one size value.
       *
       * If multiple sizes are selected, we use the first one
       * for now. We can upgrade the API later to support:
       * size=S,M,L
       */
      if (sizes.length > 0) {
        params.set("size", sizes[0]);
      }

      params.set("sort", sortBy || "newest");
      params.set("page", String(page));
      params.set("limit", String(PRODUCTS_PER_PAGE));

      return params.toString();
    },
    [
      categoryParam,
      subCategory,
      searchQuery,
      priceRange.min,
      priceRange.max,
      sizes,
      sortBy,
    ],
  );

  /*
   * Fetch a completely new product collection.
   *
   * This is used whenever category/filter/sort/search changes.
   * We start from page 1 because the previous collection
   * is no longer relevant.
   */
  const fetchFirstPage = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoadingFiltered(true);

    try {
      const query = buildProductsQuery(1);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?${query}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(
          `Products API returned ${res.status}`,
        );
      }

      const data = await res.json();

      /*
       * Ignore this response if another filter request
       * was started after this one.
       */
      if (requestId !== requestIdRef.current) {
        return;
      }

      setProducts(data.products || []);

      setPagination({
        page: data.pagination?.page || 1,
        limit:
          data.pagination?.limit ||
          PRODUCTS_PER_PAGE,
        total: data.pagination?.total || 0,
        hasNextPage:
          data.pagination?.hasNextPage || false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch filtered products:",
        error,
      );

      if (requestId === requestIdRef.current) {
        setProducts([]);
        setPagination({
          page: 1,
          limit: PRODUCTS_PER_PAGE,
          total: 0,
          hasNextPage: false,
        });
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingFiltered(false);
      }
    }
  }, [buildProductsQuery]);

  /*
   * Load the next batch of products.
   *
   * Example:
   *
   * Page 1 → products 1-12
   * Page 2 → products 13-24
   * Page 3 → products 25-36
   *
   * The user never sees page numbers.
   */
  const loadMore = useCallback(async () => {
    if (
      loadingMore ||
      loadingFiltered ||
      !pagination.hasNextPage
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      const nextPage = pagination.page + 1;
      const query = buildProductsQuery(nextPage);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?${query}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) {
        throw new Error(
          `Products API returned ${res.status}`,
        );
      }

      const data = await res.json();

      const nextProducts: IMSProduct[] =
        data.products || [];

      /*
       * Append the next batch to the existing products.
       *
       * Product ID is used to prevent accidental duplicates
       * if the observer fires more than once.
       */
      setProducts((previousProducts) => {
        const existingIds = new Set(
          previousProducts.map(
            (product) => product.productId,
          ),
        );

        const uniqueNewProducts =
          nextProducts.filter(
            (product) =>
              !existingIds.has(product.productId),
          );

        return [
          ...previousProducts,
          ...uniqueNewProducts,
        ];
      });

      setPagination({
        page: data.pagination?.page || nextPage,
        limit:
          data.pagination?.limit ||
          PRODUCTS_PER_PAGE,
        total:
          data.pagination?.total ||
          pagination.total,
        hasNextPage:
          data.pagination?.hasNextPage || false,
      });
    } catch (error) {
      console.error(
        "Failed to load more products:",
        error,
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    buildProductsQuery,
    loadingFiltered,
    loadingMore,
    pagination,
  ]);

  /*
   * When filters/search/sorting/category change,
   * fetch a fresh page 1.
   *
   * The small delay prevents hammering the API while
   * the user is typing into search.
   */
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchFirstPage();
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchFirstPage]);

  /*
   * Infinite scroll.
   *
   * The observer watches the invisible element below the grid.
   * rootMargin loads products before the user actually reaches
   * the bottom, making the experience feel continuous.
   */
  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  /*
   * Keep the existing Quick View lazy-loading behavior.
   */
  useEffect(() => {
    const idleCallback = (
      window as Window & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
        ) => number;
        cancelIdleCallback?: (
          handle: number,
        ) => void;
      }
    ).requestIdleCallback;

    if (!idleCallback) {
      return;
    }

    const id = idleCallback(() => {
      import("@/components/products/ProductQuickView");
    });

    return () => {
      const cancel =
        (
          window as Window & {
            cancelIdleCallback?: (
              handle: number,
            ) => void;
          }
        ).cancelIdleCallback;

      cancel?.(id);
    };
  }, []);

  /*
   * Remove duplicate products and keep the current
   * server-side ordering.
   *
   * We no longer filter/sort here because MongoDB already
   * performed those operations.
   */
  const groupedProducts = useMemo(() => {
    const grouped = Object.values(
      products.reduce(
        (acc, product) => {
          const key = product.name
            .trim()
            .toLowerCase();

          if (!acc[key]) {
            acc[key] = product;
          }

          return acc;
        },
        {} as Record<string, IMSProduct>,
      ),
    );

    return grouped;
  }, [products]);

  /*
   * Initial category has no products.
   *
   * This preserves the existing empty-state behavior.
   */
  if (
    initialProducts.length === 0 &&
    !loadingFiltered &&
    products.length === 0
  ) {
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
    <section
      id="categoryPage"
      className="scroll-mt-24 w-full space-y-12 px-5 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24"
    >
      <CategoryHero category={category} />

      <CategoryTabs current={category} />

      <TrustSection />

      {/* CATALOG HEADER */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 select-none">
        <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          {pagination.total}{" "}
          {pagination.total === 1
            ? "Product"
            : "Products"}{" "}
          found
        </p>

        {/* Mobile filter trigger */}
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6A0F1F] dark:text-[#e4e198] cursor-pointer"
        >
          <span>✦</span>
          <span>Filter & Sort</span>
        </button>
      </div>

      {showFilters && (
        <SideFilter
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* CATALOG LAYOUT */}
      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
        {/* Desktop sidebar */}
        <SideFilter inline />

        {/* Product area */}
        <div className="flex-1 w-full">
          {loadingFiltered ? (
            /*
             * Loading state when filters/search/sorting change.
             */
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 w-full">
              {Array.from({
                length: PRODUCTS_PER_PAGE,
              }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-3/4 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse"
                />
              ))}
            </div>
          ) : groupedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 w-full">
                {groupedProducts.map(
                  (item, index) => (
                    <motion.div
                      key={item.productId}
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
                        /*
                         * Keep the animation delay small.
                         *
                         * Previously the delay was based on the
                         * complete product index, which becomes
                         * increasingly silly as the catalogue grows.
                         */
                        delay:
                          (index % PRODUCTS_PER_PAGE) *
                          0.04,
                      }}
                    >
                      <ProductCard
                        Linked={true}
                        product={item}
                      />
                    </motion.div>
                  ),
                )}
              </div>

              {/* ================================
                  INFINITE SCROLL SENTINEL
                  ================================ */}

              <div
                ref={loadMoreRef}
                className="h-24 flex items-center justify-center"
              >
                {loadingMore && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-neutral-200 border-t-[#6A0F1F] animate-spin" />

                    <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                      Loading more
                    </p>
                  </div>
                )}

                {!loadingMore &&
                  !pagination.hasNextPage &&
                  products.length > 0 && (
                    <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                      You&apos;ve reached the end
                    </p>
                  )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 px-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950/20 shadow-xs max-w-xl mx-auto space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                No matches
              </p>

              <h3 className="font-serif text-lg text-neutral-800 dark:text-white uppercase tracking-wide">
                No Products Match Your Filters
              </h3>

              <p className="text-neutral-500 dark:text-neutral-400 text-xs font-light max-w-xs mx-auto leading-relaxed">
                Try adjusting your size, price, or clothing filters to explore
                the collection.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Quick View */}
      {/* <div className="hidden md:block">
        <ProductQuickView
          product={
            selectedIndex !== null
              ? groupedProducts[selectedIndex]
              : null
          }
          isOpen={selectedIndex !== null}
          onClose={closeProduct}
          onNext={nextProduct}
          onPrev={prevProduct}
          inventory={[]}
        />
      </div> */}

      {/* Mobile Quick View */}
      {/* <div className="md:hidden">
        <ProductStackMobile
          products={groupedProducts}
          selectedProduct={
            selectedIndex !== null
              ? groupedProducts[selectedIndex]
              : null
          }
          isOpen={selectedIndex !== null}
          onClose={closeProduct}
        />
      </div> */}
    </section>
  );
};

export default ProductClient;