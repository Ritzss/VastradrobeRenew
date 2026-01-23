"use client";

import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { IMSProduct } from "@/Types/Product";
import { useEffect } from "react";

const ProductClient = ({
  products,
  category,
}: {
  products: IMSProduct[];
  category: string;
}) => {
  const { searchQuery, selectGender, subCategory, setProducts } =
    useAppContext();

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  const normalizedCategory = category.trim().toLowerCase();
  const normalizedGender = selectGender?.trim().toLowerCase();
  const normalizedSub =
    subCategory?.replace(/-/g, " ").trim().toLowerCase() || "";
  const normalizedSearch = searchQuery.trim().toLowerCase();

 const filteredProducts = products.filter((p) => {
  const productCategory =
    p.category?.trim().toLowerCase() || "";

  const categoryMatch =
    productCategory.split(" ").includes(normalizedCategory);

  const genderMatch =
    !normalizedGender || productCategory.includes(normalizedGender);

  const productSub =
    (p.subcategory || p.subcategory || "")
      .trim()
      .toLowerCase();

  const subCategoryMatch =
    !normalizedSub || productSub === normalizedSub;

  const searchMatch =
    !normalizedSearch ||
    p.name.toLowerCase().includes(normalizedSearch) ||
    (p.description || "")
      .toLowerCase()
      .includes(normalizedSearch);

  return categoryMatch && genderMatch && subCategoryMatch && searchMatch;
});

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <h2 className="text-2xl font-bold">No products found</h2>
        <p className="text-gray-500 mt-2">
          Try selecting a different category
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
          src={item.images?.[0] || "/Assets/Images/placeholder.png"}
          description={item.description || ""}
          price={item.price}
        />
      ))}
    </div>
  );
};

export default ProductClient;
