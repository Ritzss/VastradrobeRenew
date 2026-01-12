"use client";

import { usePathname, useRouter } from "next/navigation";
import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

const ParentSubCategoryBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setSubCategory, subCategory } = useAppContext(); // ✅ IMPORTANT

  const category = pathname.split("/")[1];

  if (!category || !PARENT_SUBCATEGORIES[category]) return null;

  return (
    <div className="w-full bg-white border-b">
      <div className="flex justify-center gap-8 px-6 py-3 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => {
            setSubCategory(""); // ✅ RESET FILTER
            router.push(`/${category}`);
          }}
          className={`pb-1 whitespace-nowrap transition ${
            !subCategory
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-black"
          }`}
        >
          All
        </button>
        {PARENT_SUBCATEGORIES[category].map((sub) => {
          const slug = slugify(sub);
          const isActive = subCategory === slug;

          return (
            <button
              key={sub}
              onClick={() => {
                setSubCategory(slug); // ✅ UPDATE STATE
                router.push(`/${category}`); // optional, keeps route clean
              }}
              className={`pb-1 whitespace-nowrap transition ${
                isActive
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ParentSubCategoryBar;
