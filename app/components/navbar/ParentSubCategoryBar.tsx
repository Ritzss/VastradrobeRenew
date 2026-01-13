"use client";

import { usePathname, useRouter } from "next/navigation";
import { PARENT_SUBCATEGORIES } from "@/Data/ParentSubCat";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-");

/* ----------------------------------
   CATEGORY → SUBCATEGORY → IMAGE MAP
-----------------------------------*/
const SUBCATEGORY_IMAGES_BY_CATEGORY: Record<
  string,
  Record<string, string>
> = {
  men: {
    topwear: "/Assets/Images/subcat/men/topwear.png",
    bottomwear: "/Assets/Images/subcat/men/bottomwear.png",
    "ethnic-wear": "/Assets/Images/subcat/men/ethnicwear.png",
    "winter-wear": "/Assets/Images/subcat/men/winterwear.png",
    "festive-wear": "/Assets/Images/subcat/men/festivewear.png",
  },

  women: {
    topwear: "/Assets/Images/subcat/women/topwear.png",
    bottomwear: "/Assets/Images/subcat/women/bottomwear.png",
    "ethnic-wear": "/Assets/Images/subcat/women/ethnicwear.png",
    "winter-wear": "/Assets/Images/subcat/women/winterwear.png",
    "festive-wear": "/Assets/Images/subcat/women/festivewear.png",
  },

  boys: {
    topwear: "/Assets/Images/subcat/boys/topwear.png",
    bottomwear: "/Assets/Images/subcat/boys/bottomwear.png",
    "winter-wear": "/Assets/Images/subcat/boys/winterwear.png",
    "ethnic-wear": "/Assets/Images/subcat/boys/ethnicwear.png",
  },

  girls: {
    topwear: "/Assets/Images/subcat/girls/topwears.png",
    bottomwear: "/Assets/Images/subcat/girls/bottomwear.png",
    "winter-wear": "/Assets/Images/subcat/girls/winterwear.png",
    "ethnic-wear": "/Assets/Images/subcat/girls/ethnicwear.png",
  },

  western: {
    dresses: "/Assets/Images/subcat/western/dresses.png",
    "co-ords": "/Assets/Images/subcat/western/coords.png",
    jackets: "/Assets/Images/subcat/western/jacket.png",
  },

  traditionals: {
    kurtas: "/Assets/Images/subcat/traditional/kurtas.png",
    lehengas: "/Assets/Images/subcat/traditional/Lehenga.png",
    sherwanis: "/Assets/Images/subcat/traditional/Sherwani.png",
  },
};

const ParentSubCategoryBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { subCategory, setSubCategory } = useAppContext();

  const category = pathname.split("/")[1];

  if (!category || !PARENT_SUBCATEGORIES[category]) return null;

  return (
    <div className="w-full bg-white border-b">
      <div className="flex justify-around gap-8 px-6 py-3 overflow-x-auto">

        {/* ALL */}
        <div className="flex flex-col items-center">
          <Image
            src="/Assets/Images/subcat/allwear.png"
            alt="All"
            width={48}
            height={48}
            className="mb-1"
          />
          <button
            onClick={() => {
              setSubCategory("");
              router.push(`/${category}`);
            }}
            className={`text-sm font-semibold pb-1 ${
              !subCategory
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-black"
            }`}
          >
            All
          </button>
        </div>

        {/* SUBCATEGORIES */}
        {PARENT_SUBCATEGORIES[category].map((sub) => {
          const slug = slugify(sub);
          const isActive = subCategory === slug;

          const img =
            SUBCATEGORY_IMAGES_BY_CATEGORY[category]?.[slug];

          return (
            <div
              key={slug}
              className="flex flex-col items-center"
            >
              {img && (
                <Image
                  src={img}
                  alt={sub}
                  width={48}
                  height={48}
                  className="mb-1"
                />
              )}

              <button
                onClick={() => {
                  setSubCategory(slug);
                  router.push(`/${category}`);
                }}
                className={`text-sm font-semibold pb-1 ${
                  isActive
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-black"
                }`}
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
