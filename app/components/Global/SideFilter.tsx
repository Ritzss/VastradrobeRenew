/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
// import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
  ethnic: ["ethnic"],
};

const SideFilter = ({
  onClose,
  className,
}: {
  className?: string;
  onClose?: () => void;
}) => {
  const pathname = usePathname();
  const categoryFromRoute = pathname.split("/")[1];

  const {
    products,
    subCategory,
    setSubCategory,
    priceRange,
    setPriceRange,
    sizes,
    setSizes,
  } = useAppContext();

  // console.log(products);

  const safeProducts = products || [];
  const normalize = (val: string) => val?.trim().toLowerCase();
  const availableSubCategories = useMemo(() => {
    if (!categoryFromRoute) return [];

    const allowedCategories = CATEGORY_MAP[normalize(categoryFromRoute)] || [];

    return Array.from(
      new Set(
        safeProducts
          .filter((p: any) => allowedCategories.includes(normalize(p.category)))
          .map((p: any) => p.subcategory) // lowercase s
          .filter(Boolean),
      ),
    ).sort();
  }, [products, categoryFromRoute]);

  const availableSizes = useMemo(() => {
    if (!categoryFromRoute) return [];

    const allowedCategories = CATEGORY_MAP[normalize(categoryFromRoute)] || [];

    const filtered = safeProducts.filter((p: any) =>
      allowedCategories.includes(normalize(p.category)),
    );

    return Array.from(
      new Set(
        filtered
          .flatMap((p: any) =>
            (p.variants || []).flatMap((v: any) => v.sizes || []),
          )
          .map((size: string) =>
            size.replace(/\s+/g, " ").trim().toUpperCase(),
          ),
      ),
    ).sort();
  }, [products, categoryFromRoute]);

  if (!categoryFromRoute) return null;

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s: string) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const clearFilters = () => {
    setSubCategory("");
    setPriceRange({ min: "", max: "" });
    setSizes([]);
  };

  return (
    <>
      {onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 right-0 h-full w-80 z-50 light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] transform transition-transform duration-300 ease-in-out ${onClose ? "translate-x-0" : ""} p-8 overflow-y-auto`} >
        {/* TITLE */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a] mb-3">
              Refine
            </p>
            <h3 className="text-2xl font-semibold text-[#5f5143]">Filters</h3>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-[#6a0f1f] border border-[#6a0f1f] px-3 py-1 rounded-full hover:bg-[#6a0f1f] hover:text-white transition"
          >
            Clear
          </button>
        </div>

        {/* CATEGORY */}
        <div className="mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-[#957f6a] mb-6">
            Category
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSubCategory("");
                onClose?.();
              }}
              className={`px-5 py-2 rounded-full text-sm transition ${!subCategory ? "bg-[#6a0f1f] text-white" : "bg-[#e6d8c8] text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white" }`}
            >
              All
            </button>

            {availableSubCategories.map((sub) => {
              const slug = slugify(sub);
              const active = slug === subCategory;

              return (
                <button
                  key={slug}
                  onClick={() => {
                    setSubCategory(slug);
                    onClose?.();
                  }}
                  className={`px-5 py-2 rounded-full text-sm transition
                ${
                  active
                    ? "bg-[#6a0f1f] text-white"
                    : "bg-[#e6d8c8] text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white"
                }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRICE */}
        <div className="mb-14">
          <p className="uppercase tracking-[0.25em] text-xs text-[#957f6a] mb-6">
            Price Range
          </p>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min"
              value={priceRange?.min || ""}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  min: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full bg-white border border-[#e6d8c8] rounded-full px-4 py-3 text-sm outline-none focus:border-[#6a0f1f]"
            />

            <input
              type="number"
              placeholder="Max"
              value={priceRange?.max || ""}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full bg-white border border-[#e6d8c8] rounded-full px-4 py-3 text-sm outline-none focus:border-[#6a0f1f]"
            />
          </div>
        </div>

        {/* SIZE */}
        {availableSizes.length > 0 && (
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-[#957f6a] mb-6">
              Sizes
            </p>

            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => {
                const active = sizes.includes(size);

                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-full text-sm transition
                  ${
                    active
                      ? "bg-[#6a0f1f] text-white"
                      : "bg-[#e6d8c8] text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white"
                  }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideFilter;
