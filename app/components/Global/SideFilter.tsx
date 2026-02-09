"use client";

import { usePathname } from "next/navigation";
import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const SideFilter = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const categoryFromRoute = pathname.split("/")[1];

  const { subCategory, setSubCategory } = useAppContext();

  if (!categoryFromRoute || !PARENT_SUBCATEGORIES[categoryFromRoute]) {
    return null;
  }

  return (
    <aside className="w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="flex flex-wrap gap-2">
        {/* ALL TAB */}
        <button
          onClick={() => {
            setSubCategory("");
            onClose?.();
          }}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border
                ${
                  !subCategory
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                }`}
        >
          All
        </button>

        {PARENT_SUBCATEGORIES[categoryFromRoute].map((sub) => {
          const slug = slugify(sub);
          const active = slug === subCategory;

          return (
            <button
              key={slug}
              onClick={() => {
                setSubCategory(slug);
                onClose?.();
              }}
              className={`
          px-3 py-1.5 rounded-md text-xs font-medium border
          ${
            active
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
          }
        `}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default SideFilter;
