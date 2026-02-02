"use client";

import CategoryCard from "./CategoryCard";
import { categoryData } from "@/Data/CategoryData";

const CategorySlider = () => {
  // duplicate data once for looping illusion
  const items = [...categoryData, ...categoryData];

  return (
    <main
      id="cards"
      className="w-full flex flex-col gap-5 overflow-x-hidden h-[30%] m-auto"
    >
      <div
        id="cardsslider"
        className="flex gap-2 py-1 shadow-[inset_0_0_30px_16px_#cd0000] slider"
      >
        {items.map((item, index) => (
          <CategoryCard key={index} {...item} />
        ))}
      </div>
    </main>
  );
};

export default CategorySlider;
