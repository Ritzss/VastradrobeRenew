"use client";

import { usePathname, useRouter } from "next/navigation";
import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const ParentSubCategoryBar = ({ className }: { className: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { subCategory, setSubCategory } = useAppContext();

  const category = pathname.split("/")[1];

  if (!category || !PARENT_SUBCATEGORIES[category]) return null;

  return (
    <div
      className={`
        w-full bg-white
        ${className}
      `}
    >
      <div
        className=" flex items-center justify-start md:justify-center gap-4 md:gap-8 px-3 md:px-6 py-3 overflow-x-auto no-scrollbar"
      >
        {/* ALL */}
        <div className="flex flex-col items-center shrink-0">
          <button
            onClick={() => {
              setSubCategory("");
              router.push(`/${category}`);
            }}
            className={`
              text-xs sm:text-sm md:text-base
              font-semibold
              pb-1
              ${
                !subCategory
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-black"
              }
            `}
          >
            All
          </button>
        </div>

        {/* SUBCATEGORIES */}
        {PARENT_SUBCATEGORIES[category].map((sub) => {
          const slug = slugify(sub);
          const isActive = subCategory === slug;

          return (
            <div key={slug} className="flex flex-col items-center shrink-0">
              <button
                onClick={() => {
                  setSubCategory(slug);
                  router.push(`/${category}`);
                }}
                className={`
                  text-xs sm:text-sm md:text-base
                  font-semibold
                  pb-1
                  whitespace-nowrap
                  ${
                    isActive
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-600 hover:text-black"
                  }
                `}
              >
                {sub}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParentSubCategoryBar;
