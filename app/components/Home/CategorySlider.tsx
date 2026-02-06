"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { categoryData } from "@/Data/CategoryData";

const CategorySlider = () => {
  const [items, setItems] = useState(categoryData);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const updateItems = () => {
      setItems(media.matches ? [...categoryData, ...categoryData] : categoryData);
    };

    updateItems();
    media.addEventListener("change", updateItems);

    return () => media.removeEventListener("change", updateItems);
  }, []);

  return (
    <section className="w-full overflow-hidden">
      <div className="flex w-max gap-4 animate-category-scroll hover:[animation-play-state:paused]">
        {items.map((item, index) => (
          <CategoryCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default CategorySlider;
