/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const CATEGORY_MAP: Record<string, string[]> = {
men: ["men"],
women: ["women"],
kids: ["boys", "girls"],
ethnic: ["ethnic"],
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
  } = useAppContext();
  
  const subCategories = useMemo(() => {
    if (!categoryFromRoute) return [];
    return PARENT_SUBCATEGORIES[categoryFromRoute] || [];
  }, [categoryFromRoute]);

 const normalize = (val: string) =>
  val?.trim().toLowerCase();

const availableSizes = useMemo(() => {
  if (!categoryFromRoute) return [];

  const allowedCategories =
    CATEGORY_MAP[normalize(categoryFromRoute)] || [];

  const filtered = products.filter((p: any) =>
    allowedCategories.includes(normalize(p.category))
  );

  return Array.from(
    new Set(
      filtered
        .flatMap((p: any) => p.sizes || [])
        .map((size: string) =>
          size.replace(/\s+/g, " ").trim().toUpperCase()
        )
    )
  ).sort();
}, [products, categoryFromRoute]);

  if (!subCategories.length) return null;
  
  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s: string) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  return (
     <>
    {/* MOBILE OVERLAY */}
    {onClose && (
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
      />
    )}

    <aside
      className={`
        fixed md:static top-0 right-0 h-full w-80 z-50
        transform transition-transform duration-300 ease-in-out
        md:w-64 md:h-auto md:translate-x-0
        ${onClose ? "translate-x-0" : ""}
        md:border-r
        p-5 overflow-y-auto
      `}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-[#6a0f1f]">
          Filters
        </h3>

        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-sm text-red-600"
          >
            Close
          </button>
        )}
      </div>

      {/* SUBCATEGORY */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold mb-3 text-gray-600">
          Category
        </h4>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSubCategory("");
              onClose?.();
            }}
            className={`px-3 py-1.5 rounded-full text-xs border transition
              ${
                !subCategory
                  ? "bg-[#6a0f1f] text-white border-[#6a0f1f]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#6a0f1f]"
              }`}
          >
            All
          </button>

          {subCategories.map((sub) => {
            const slug = slugify(sub);
            const active = slug === subCategory;

            return (
              <button
                key={slug}
                onClick={() => {
                  setSubCategory(slug);
                  onClose?.();
                }}
                className={`px-3 py-1.5 rounded-full text-xs border transition
                  ${
                    active
                      ? "bg-[#6a0f1f] text-white border-[#6a0f1f]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#6a0f1f]"
                  }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold mb-3 text-gray-600">
          Price Range
        </h4>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={priceRange?.min || ""}
            onChange={(e) =>
              setPriceRange({
                ...priceRange,
                min:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              })
            }
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6a0f1f]"
          />

          <input
            type="number"
            placeholder="Max"
            value={priceRange?.max || ""}
            onChange={(e) =>
              setPriceRange({
                ...priceRange,
                max:
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value),
              })
            }
            className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6a0f1f]"
          />
        </div>
      </div>

      {/* SIZE */}
      {availableSizes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gray-600">
            Sizes
          </h4>

          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const active = sizes.includes(size);

              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 h-9 text-xs font-medium rounded-md border transition
                    ${
                      active
                        ? "bg-[#6a0f1f] text-white border-[#6a0f1f]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#6a0f1f]"
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
