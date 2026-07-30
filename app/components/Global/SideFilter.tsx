/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

const sortOptions = [
  { value: "featured", label: "Featured Sort" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "name-asc", label: "Alphabetical: A → Z" },
  { value: "name-desc", label: "Alphabetical: Z → A" },
];

type SideFilterProps = {
  onClose?: () => void;
  inline?: boolean;
};

/**
 * 👑 LUXURY REDESIGN: Sidebar Filter (Nangalia Ruchira Theme)
 *
 * Supports both:
 * 1. 📂 Slide-Out Drawer (on mobile touch viewports / click-to-filter fallback)
 * 2. 🏛️ Permanent Docked Left-Sidebar (on desktop split viewports!)
 *
 * Elite Features:
 * - 🎁 Collapsing sections for Categories, Price, and Sizes with interactive chevron rotations.
 * - 🪐 Custom React-State Dropdown: Bypasses ugly default OS select controls with an ultra-premium,
 *   perfectly coordinated theme dropdown that has smooth hovers and active star highlights.
 */
const SideFilter = ({ onClose, inline = false }: SideFilterProps) => {
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
    sortBy,
    setSortBy,
  } = useAppContext();

  // Dropdown & Collapsing states
  const [sortOpen, setSortOpen] = useState(false);
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
  const [priceCollapsed, setPriceCollapsed] = useState(false);
  const [sizesCollapsed, setSizesCollapsed] = useState(false);

  const safeProducts = products || [];
  const normalize = (val: string) => val?.trim().toLowerCase();

  const availableSubCategories = useMemo(() => {
    if (!categoryFromRoute) return [];

    const normRoute = normalize(categoryFromRoute);
    let allowedCategories = CATEGORY_MAP[normRoute] || [
      "men",
      "women",
      "boys",
      "girls",
    ];

    if (normRoute === "all") {
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
          .map((p: any) => p.subcategory)
          .filter(Boolean),
      ),
    ).sort();
  }, [categoryFromRoute, safeProducts, selectedCategory]);

  const availableSizes = useMemo(() => {
    if (!categoryFromRoute) return [];

    const normRoute = normalize(categoryFromRoute);
    let allowedCategories = CATEGORY_MAP[normRoute] || [
      "men",
      "women",
      "boys",
      "girls",
    ];

    if (normRoute === "all") {
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
  }, [categoryFromRoute, safeProducts, selectedCategory]);

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

  const currentSortOption =
    sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  const filterContent = (
    <div className={inline ? "space-y-8 pr-2" : "px-7 py-8 space-y-10"}>
      {/* 1. SORT BY SECTION (Static header with custom engineered luxury dropdown menu) */}
      <section className="space-y-4 relative">
        <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          Sort Arrange
        </span>

        <div className="relative">
          {/* Custom Trigger Button */}
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="w-full flex items-center justify-between rounded-md border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 hover:border-[#6A0F1F] dark:hover:border-[#e4e198] transition duration-200 cursor-pointer shadow-xs"
          >
            <span>{currentSortOption.label}</span>
            <ChevronDown
              size={13}
              className={`text-neutral-400 transition-transform duration-300 ${sortOpen ? "rotate-180 text-[#6A0F1F] dark:text-[#e4e198]" : ""}`}
            />
          </button>

          {/* Custom Options Panel */}
          {sortOpen && (
            <>
              {/* Invisible click backdrop to close the dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-md shadow-2xl py-1.5 z-30 divide-y divide-neutral-50 dark:divide-neutral-900 max-h-56 overflow-y-auto">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest transition duration-200 cursor-pointer flex items-center justify-between ${
                      sortBy === opt.value
                        ? "text-[#6A0F1F] dark:text-[#e4e198] bg-neutral-50/50 dark:bg-neutral-900"
                        : "text-neutral-500 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && (
                      <span className="text-[10px] text-[#6A0F1F] dark:text-[#e4e198]">
                        ✦
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. CATEGORY GROUP (Only for 'all' route) */}
      {categoryFromRoute === "all" && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Section Group
          </p>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "All Group", value: "" },
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
                className={`px-5 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition duration-200 border cursor-pointer shadow-xs ${
                  selectedCategory === item.value
                    ? "bg-[#6A0F1F] border-[#6A0F1F] dark:bg-[#e4e198] dark:border-[#e4e198] text-white dark:text-neutral-950"
                    : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-800 dark:hover:border-neutral-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUBCATEGORY / CLOTHING TYPES (With Collapse) */}
      <section className="space-y-4">
        <button
          onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
          className="flex items-center justify-between w-full border-b border-neutral-100 dark:border-neutral-900 pb-2 cursor-pointer animate-fade"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={12}
              className="text-[#6A0F1F] dark:text-[#e4e198]"
            />
            <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Clothing Types
            </span>
          </div>
          <ChevronDown
            size={13}
            className={`text-neutral-400 transition-transform duration-300 ${categoriesCollapsed ? "-rotate-90" : ""}`}
          />
        </button>

        {!categoriesCollapsed && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setSubCategory("");
                onClose?.();
              }}
              className={`rounded-md px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition duration-200 border cursor-pointer shadow-xs ${
                !subCategory
                  ? "bg-[#6A0F1F] border-[#6A0F1F] dark:bg-[#e4e198] dark:border-[#e4e198] text-white dark:text-neutral-950"
                  : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-800 dark:hover:border-neutral-500"
              }`}
            >
              All Apparel
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
                  className={`rounded-md px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition duration-200 border cursor-pointer shadow-xs ${
                    active
                      ? "bg-[#6A0F1F] border-[#6A0F1F] dark:bg-[#e4e198] dark:border-[#e4e198] text-white dark:text-neutral-950"
                      : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-800 dark:hover:border-neutral-500"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. PRICE SLIDER (With Collapse) */}
      <section className="space-y-4">
        <button
          onClick={() => setPriceCollapsed(!priceCollapsed)}
          className="flex justify-between items-center w-full border-b border-neutral-100 dark:border-neutral-900 pb-2 cursor-pointer"
        >
          <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Pricing Range
          </span>
          <ChevronDown
            size={13}
            className={`text-neutral-400 transition-transform duration-300 ${priceCollapsed ? "-rotate-90" : ""}`}
          />
        </button>

        {!priceCollapsed && (
          <div className="mt-4">
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
        )}
      </section>

      {/* 5. SIZES FILTERS (With Collapse) */}
      {availableSizes.length > 0 && (
        <section className="space-y-4">
          <button
            onClick={() => setSizesCollapsed(!sizesCollapsed)}
            className="flex items-center justify-between w-full border-b border-neutral-100 dark:border-neutral-900 pb-2 cursor-pointer"
          >
            <span className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Available Sizes
            </span>
            <ChevronDown
              size={13}
              className={`text-neutral-400 transition-transform duration-300 ${sizesCollapsed ? "-rotate-90" : ""}`}
            />
          </button>

          {!sizesCollapsed && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {availableSizes.map((size) => {
                const active = sizes.includes(size);

                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`min-w-12 rounded-md border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition duration-200 cursor-pointer shadow-xs ${
                      active
                        ? "bg-[#6A0F1F] border-[#6A0F1F] dark:bg-[#e4e198] dark:border-[#e4e198] text-white dark:text-neutral-950"
                        : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-800 dark:hover:border-neutral-500"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 6. ACTIVE FILTER STATUS */}
      <section className="space-y-4">
        <div className="rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 space-y-3 shadow-inner">
          <p className="text-[9px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Active Filter Status
          </p>

          <div className="flex flex-wrap gap-2 pt-1.5">
            {!!subCategory && (
              <span className="rounded-md bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-xs">
                {subCategory}
              </span>
            )}

            {sizes.map((size) => (
              <span
                key={size}
                className="rounded-md bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-xs"
              >
                {size}
              </span>
            ))}

            {priceRange.min !== "" && (
              <span className="rounded-md bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-xs">
                ₹{priceRange.min}+
              </span>
            )}

            {priceRange.max !== "" && (
              <span className="rounded-md bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-xs">
                Up to ₹{priceRange.max}
              </span>
            )}

            {!subCategory &&
              sizes.length === 0 &&
              priceRange.min === "" &&
              priceRange.max === "" && (
                <p className="text-[10px] font-medium tracking-wide uppercase text-neutral-400">
                  No filters selected
                </p>
              )}
          </div>
        </div>
      </section>
    </div>
  );

  // RENDER DOCKED INLINE LEFT-SIDEBAR (For Desktop)
  if (inline) {
    return (
      <aside className="hidden md:block w-72 shrink-0 border-r border-neutral-100 dark:border-neutral-900 pr-8 space-y-8 select-none relative z-10 h-auto">
        <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Filter Shelf
          </p>
          <h2 className="font-serif text-2xl font-light text-neutral-800 dark:text-white uppercase tracking-wide mt-1">
            Refine Items
          </h2>
        </div>

        {filterContent}

        {/* Inlined footer reset */}
        <div className="pt-4">
          <button
            onClick={clearFilters}
            className="w-full rounded-md border border-[#6A0F1F] dark:border-[#e4e198] py-3 text-[#6A0F1F] dark:text-[#e4e198] hover:bg-[#6A0F1F] dark:hover:bg-[#e4e198] hover:text-white dark:hover:text-black font-semibold text-[10px] uppercase tracking-widest transition duration-200 cursor-pointer shadow-xs bg-white dark:bg-neutral-950"
          >
            Reset All Filters
          </button>
        </div>
      </aside>
    );
  }

  // RENDER SLIDE-OUT PANEL (For Mobile drawer)
  return (
    <>
      {/* Blurred backdrop overlay */}
      {onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 h-screen bg-black/40 backdrop-blur-xs z-40 animate-fadeIn"
        />
      )}

      <aside className="fixed right-0 top-0 h-screen w-96 max-w-[95vw] bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 z-50 shadow-2xl rounded-l-2xl overflow-y-auto border-l border-neutral-100 dark:border-neutral-900 transition-all duration-300">
        {/* HEADER */}
        <div className="sticky top-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 px-7 py-6 z-20 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Filter Shelf
            </p>
            <h2 className="font-serif text-2xl font-light text-neutral-800 dark:text-white uppercase tracking-wide mt-1">
              Refine Items
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            aria-label="Close panel"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {filterContent}

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-950/95 border-t border-neutral-100 dark:border-neutral-900 p-6 z-20">
          <button
            onClick={clearFilters}
            className="w-full rounded-md border border-[#6A0F1F] dark:border-[#e4e198] py-3.5 text-[#6A0F1F] dark:text-[#e4e198] hover:bg-[#6A0F1F] dark:hover:bg-[#e4e198] hover:text-white dark:hover:text-black font-semibold text-xs uppercase tracking-widest transition duration-200 cursor-pointer shadow-xs bg-white dark:bg-neutral-950"
          >
            Reset All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideFilter;
