"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";
import { prioritizeVariant } from "@/lib/productColor";

type Props = {
  initialProducts: IMSProduct[];
  variants: string[];
  total: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};

const PRODUCTS_PER_PAGE = 12;

export default function ColorProductsClient({
  initialProducts,
  variants,
  total: initialTotal,
}: Props) {
  /* =========================================================
     PRODUCTS
     ========================================================= */

  const [products, setProducts] = useState<IMSProduct[]>(initialProducts);

  /* =========================================================
     PAGINATION
     ========================================================= */

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    total: initialTotal,
    hasNextPage: initialProducts.length < initialTotal,
  });

  const [loadingMore, setLoadingMore] = useState(false);

  /* =========================================================
     INFINITE SCROLL REFS
     ========================================================= */

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /*
   * Prevents multiple requests from being fired
   * simultaneously by IntersectionObserver.
   */
  const loadingRef = useRef(false);

  /*
   * Keeps track of the current API page without
   * recreating the observer after every request.
   */
  const pageRef = useRef(1);

  /*
   * Keeps track of whether another page exists.
   */
  const hasNextPageRef = useRef(initialProducts.length < initialTotal);

  /* =========================================================
     KEEP REFS IN SYNC
     ========================================================= */

  useEffect(() => {
    pageRef.current = pagination.page;

    hasNextPageRef.current = pagination.hasNextPage;
  }, [pagination]);

  /* =========================================================
     LOAD MORE PRODUCTS
     ========================================================= */

  const loadMore = useCallback(async () => {
    /*
     * Prevent duplicate requests.
     */
    if (loadingRef.current || !hasNextPageRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;

    try {
      const params = new URLSearchParams();

      /*
       * Send all database color variants belonging
       * to the selected storefront color.
       *
       * Example:
       *
       * color=Blue,Navy,Sky Blue
       */
      params.set("color", variants.join(","));

      params.set("page", String(nextPage));

      params.set("limit", String(PRODUCTS_PER_PAGE));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Products API returned ${response.status}`);
      }

      const data = await response.json();

      const nextProducts: IMSProduct[] = data.products || [];

      const apiPagination = data.pagination;

      /*
       * Add only products that have not already
       * been rendered.
       */
      setProducts((previousProducts) => {
        const existingIds = new Set(
          previousProducts.map((product) => product.productId),
        );

        const uniqueProducts = nextProducts.filter(
          (product) => !existingIds.has(product.productId),
        );

        return [...previousProducts, ...uniqueProducts];
      });

      /*
       * Use the API response as the pagination
       * source of truth.
       */
      const actualPage = apiPagination?.page ?? nextPage;

      const actualLimit = apiPagination?.limit ?? PRODUCTS_PER_PAGE;

      const actualTotal = apiPagination?.total ?? initialTotal;

      const hasNext = apiPagination?.hasNextPage ?? false;

      const nextPagination: Pagination = {
        page: actualPage,
        limit: actualLimit,
        total: actualTotal,
        hasNextPage: hasNext,
      };

      setPagination(nextPagination);

      /*
       * Update refs immediately.
       *
       * IntersectionObserver does not wait for
       * React state updates.
       */
      pageRef.current = actualPage;

      hasNextPageRef.current = hasNext;
    } catch (error) {
      console.error("Failed to load more color products:", error);
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [variants, initialTotal]);

  /* =========================================================
     INFINITE SCROLL OBSERVER
     ========================================================= */

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
        root: null,

        /*
         * Begin loading before the user reaches
         * the actual bottom of the collection.
         */
        rootMargin: "500px 0px",

        threshold: 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  /* =========================================================
     PRODUCT DISPLAY

     Make the selected storefront color variant the
     preferred variant shown by ProductCard.
     ========================================================= */

  const displayProducts = products.map((product) =>
    prioritizeVariant(product, variants),
  );

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section>
      {/* =====================================================
          PRODUCT COUNT
          ===================================================== */}

      <div className="mb-8 flex items-center">
        <p className="shrink-0 text-xs tracking-wide text-[#85766a]">
          {pagination.total} {pagination.total === 1 ? "product" : "products"}
        </p>

        <div className="ml-5 h-px flex-1 bg-[#ded5ca]" />
      </div>

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      {displayProducts.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-4xl border border-dashed border-[#d8cec3] bg-[#f5f0e9]">
          <div className="max-w-sm px-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cec3] text-[#927f6c]">
              —
            </span>

            <p className="mt-5 font-serif text-2xl text-[#4d433a]">
              No products found
            </p>

            <p className="mt-2 text-xs leading-6 text-[#85766a]">
              There are currently no products available in this collection.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* =================================================
              PRODUCT GRID
              ================================================= */}

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12">
            {displayProducts.map((product) => (
              <div
                key={product.productId}
                className=" w-[calc(50%-6px)] sm:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
              >
                <ProductCard product={product} Linked />
              </div>
            ))}
          </div>

          {/* =================================================
              INFINITE SCROLL
              ================================================= */}

          <div
            ref={loadMoreRef}
            className="flex min-h-27.5 items-center justify-center"
          >
            {/* Loading */}

            {loadingMore && (
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-[#d8cec3] border-t-[#6A0F1F]"
                aria-label="Loading products"
              />
            )}

            {/* End */}

            {!loadingMore && !pagination.hasNextPage && products.length > 0 && (
              <div className="flex w-full items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#d8cec3]" />

                <span className="text-[9px] uppercase tracking-[0.25em] text-[#9a8876]">
                  End of collection
                </span>

                <span className="h-px w-10 bg-[#d8cec3]" />
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
