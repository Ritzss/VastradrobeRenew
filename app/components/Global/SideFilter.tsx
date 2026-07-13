/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useMemo } from "react";
// import { usePathname } from "next/navigation";
// // import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
// import { useAppContext } from "@/hooks/useAppContext";
// "use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import PriceSlider from "../UI/PriceSlider";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const CATEGORY_MAP: Record<string, string[]> = {
  all: ["men", "women", "boys", "girls"],
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
};

const SideFilter = ({ onClose }: { onClose?: () => void }) => {
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
    selectedCategory,
    setSelectedCategory,
  } = useAppContext();

  // console.log(products);

  const safeProducts = products || [];
  const normalize = (val: string) => val?.trim().toLowerCase();
  const availableSubCategories = useMemo(() => {
    if (!categoryFromRoute) return [];

    let allowedCategories = CATEGORY_MAP[normalize(categoryFromRoute)] || [];

    if (normalize(categoryFromRoute) === "all") {
      switch (selectedCategory) {
        case "men":
          allowedCategories = ["men"];
          break;

        case "women":
          allowedCategories = ["women"];
          break;

        case "kids":
          allowedCategories = ["boys", "girls"];
          break;

        default:
          allowedCategories = ["men", "women", "boys", "girls"];
      }
    }

    return Array.from(
      new Set(
        safeProducts
          .filter((p: any) => allowedCategories.includes(normalize(p.category)))
          .map((p: any) => p.subcategory) // lowercase s
          .filter(Boolean),
      ),
    ).sort();
  }, [categoryFromRoute, safeProducts]);

  const availableSizes = useMemo(() => {
    if (!categoryFromRoute) return [];

    let allowedCategories = CATEGORY_MAP[normalize(categoryFromRoute)] || [];

    if (normalize(categoryFromRoute) === "all") {
      switch (selectedCategory) {
        case "men":
          allowedCategories = ["men"];
          break;

        case "women":
          allowedCategories = ["women"];
          break;

        case "kids":
          allowedCategories = ["boys", "girls"];
          break;

        default:
          allowedCategories = ["men", "women", "boys", "girls"];
      }
    }

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
  }, [categoryFromRoute, safeProducts]);

  const MIN_PRICE = 0;
  const MAX_PRICE = 5000;

  const [sliderValue, setSliderValue] = useState<[number, number]>([
    typeof priceRange.min === "number" ? priceRange.min : MIN_PRICE,
    typeof priceRange.max === "number" ? priceRange.max : MAX_PRICE,
  ]);

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
      {/* Overlay */}
      {onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 h-screen bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 h-screen w-95 max-w-[95vw] dark:bg-[#1a1a1a] dark:text-white bg-white z-50 shadow-2xl rounded-l-3xl overflow-y-auto transition-all duration-500`}
      >
        {/* HEADER */}

        <div className="sticky top-0 dark:bg-[#1a1a1a] bg-white border-b dark:border-[#1a1a1a] border-neutral-200 px-7 py-6 z-20">
          <div className="flex justify-between items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
                Collection
              </p>

              <h2 className="text-3xl font-semibold text-[#5f5143] mt-2">
                Filters
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-neutral-100 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-7 py-8 space-y-10">
          {/* CATEGORY */}

          {categoryFromRoute === "all" && (
            <div className="mb-10">
              <p className="uppercase tracking-[0.25em] text-xs text-[#957f6a] mb-6">
                Category
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { label: "All", value: "" },
                  { label: "Men", value: "men" },
                  { label: "Women", value: "women" },
                  { label: "Kids", value: "kids" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedCategory(item.value);
                      setSubCategory("");
                    }}
                    className={`px-5 py-2 rounded-full transition ${
                      selectedCategory === item.value
                        ? "bg-[#5f5143] text-white"
                        : "dark:bg-[#1a1a1a] bg-[#f5f2ef] dark:hover:bg-[#2c2c2c] hover:bg-[#ece6df]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUBCATEGORY */}

          <section>
            <button className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#5f5143]" />

                <span className="font-semibold text-[#5f5143]">Categories</span>
              </div>

              <ChevronDown size={18} />
            </button>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSubCategory("");
                  onClose?.();
                }}
                className={`rounded-full px-5 py-2 transition ${!subCategory ? "bg-[#5f5143] text-white" : "bg-[#f5f2ef] hover:bg-[#ece6df]"}`}
              >
                All
              </button>

              {availableSubCategories.map((sub) => {
                const slug = slugify(sub);

                const active = subCategory === slug;

                return (
                  <button
                    key={slug}
                    onClick={() => {
                      setSubCategory(slug);
                      onClose?.();
                    }}
                    className={`rounded-full px-5 py-2 transition ${active ? "bg-[#5f5143] text-white" : "dark:bg-[#1a1a1a] bg-[#f5f2ef] dark:hover:bg-[#2c2c2c] hover:bg-[#ece6df]"}`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </section>

          {/* PRICE */}

          <section>
            <button className="flex justify-between items-center w-full">
              <span className="font-semibold text-[#5f5143]">Price</span>

              <ChevronDown size={18} />
            </button>

            <div className="mt-8">
              <PriceSlider
                value={sliderValue}
                onValueChange={(value) => {
                  setSliderValue(value);

                  setPriceRange({
                    min: value[0],
                    max: value[1],
                  });
                }}
              />
            </div>
          </section>

          {/* SIZE */}

          {availableSizes.length > 0 && (
            <section>
              <button className="flex items-center justify-between w-full">
                <span className="font-semibold text-[#5f5143]">Sizes</span>

                <ChevronDown size={18} />
              </button>

              <div className="mt-6 flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const active = sizes.includes(size);

                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${active ? "bg-[#5f5143] border-[#5f5143] text-white" : "dark:bg-[#1a1a1a] bg-[#f5f2ef] dark:hover:bg-[#2c2c2c] hover:bg-[#ece6df]"}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ACTIVE FILTERS */}

          <section>
            <div className="rounded-2xl dark:bg-[#1a1a1a] dark:hover:bg-[#2c2c2c] hover:bg-[#ece6df] bg-[#faf8f5] border border-[#ece6df] p-5">
              <p className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
                Active Filters
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {!!subCategory && (
                  <span className="rounded-full bg-[#5f5143] text-white px-4 py-2 text-xs">
                    {subCategory}
                  </span>
                )}

                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-full bg-[#5f5143] text-white px-4 py-2 text-xs"
                  >
                    {size}
                  </span>
                ))}

                {priceRange.min !== "" && (
                  <span className="rounded-full bg-[#5f5143] text-white px-4 py-2 text-xs">
                    ₹{priceRange.min}+
                  </span>
                )}

                {priceRange.max !== "" && (
                  <span className="rounded-full bg-[#5f5143] text-white px-4 py-2 text-xs">
                    Up to ₹{priceRange.max}
                  </span>
                )}

                {!subCategory &&
                  sizes.length === 0 &&
                  priceRange.min === "" &&
                  priceRange.max === "" && (
                    <p className="text-sm text-neutral-500">
                      No filters selected
                    </p>
                  )}
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}

        <div className="sticky bottom-0 dark:bg-[#1a1a1a] bg-white border-t border-neutral-200 p-6">
          <button
            onClick={clearFilters}
            className="w-full rounded-full border border-[#5f5143] py-3 dark:text-white text-[#5f5143] font-medium hover:bg-[#5f5143] hover:text-white transition"
          >
            Reset Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideFilter;
