"use client";

import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { normalize } from "@/lib/normalize";
import { IMSProduct } from "@/Types/Product";

const ProductClient = ({
  products,
}: {
  products: IMSProduct[];
}) => {
  const { searchQuery, subCategory } = useAppContext();

  const normalizedSub = normalize(subCategory);
  const normalizedSearch = searchQuery?.toLowerCase() || "";

  const filteredProducts = products.filter((p) => {
  const subCategoryMatch =
    !normalizedSub || normalize(p.subcategory) === normalizedSub;

  const searchMatch =
    !normalizedSearch ||
    p.name.toLowerCase().includes(normalizedSearch) ||
    (p.description || "").toLowerCase().includes(normalizedSearch);

  return subCategoryMatch && searchMatch;
});


  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <h2 className="text-2xl font-bold">No products found</h2>
        <p className="text-gray-500 mt-2">Try changing search or category</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-evenly text-black">
      {filteredProducts.map((item) => (
        <ProductCard
          key={item.productId} product={item} className={""}        />
      ))}
    </div>
  );
};

export default ProductClient;
