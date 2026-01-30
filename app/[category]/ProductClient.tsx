"use client";

import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { IMSProduct } from "@/Types/Product";

const ProductClient = ({
  products,
  category,
}: {
  products: IMSProduct[];
  category: string;
}) => {
  const { searchQuery, subCategory } = useAppContext();

  const normalizedCategory = category?.toLowerCase() || "";
  const normalizedSub = subCategory?.toLowerCase() || "";
  const normalizedSearch = searchQuery?.toLowerCase() || "";

  const filteredProducts = products.filter((p) => {
    // CATEGORY
    const categoryMatch =
      !normalizedCategory || p.category?.toLowerCase() === normalizedCategory;

    // SUBCATEGORY
    const subCategoryMatch =
      !normalizedSub ||
      p.subcategory?.toLowerCase() === normalizedSub;

    // SEARCH
    const searchMatch =
      !normalizedSearch ||
      p.name.toLowerCase().includes(normalizedSearch) ||
      (p.description || "")
        .toLowerCase()
        .includes(normalizedSearch);

    return categoryMatch && subCategoryMatch && searchMatch;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <h2 className="text-2xl font-bold">No products found</h2>
        <p className="text-gray-500 mt-2">
          Try changing search or category
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-evenly text-black">
      {filteredProducts.map((item) => (
        <ProductCard
          key={item.productId}
          Pid={item.productId}
          title={item.name}
          src={item.images?.[0]}
          description={item.description || ""}
          price={item.price}
        />
      ))}
    </div>
  );
};

export default ProductClient;
