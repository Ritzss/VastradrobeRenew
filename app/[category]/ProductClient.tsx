"use client";

import ProductCard from "@/components/Global/ProductCard";
import { useAppContext } from "@/hooks/useAppContext";
import { Product } from "@/Types/Product";
import { useEffect } from "react";

const ProductClient = ({
  products,
  category,
}: {
  products: Product[];
  category: string;
}) => {
  const {
    searchQuery,
    selectGender,
    subCategory,
    setProducts,
  } = useAppContext();

  /* ----------------------------------
     STORE PRODUCTS IN CONTEXT
  -----------------------------------*/
  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  /* ----------------------------------
     FILTER LOGIC
  -----------------------------------*/
  const filteredProducts = products.filter((p) => {
    const categoryMatch = p.category
      .toLowerCase()
      .includes(category.toLowerCase());

    const normalizedSub =
      subCategory?.replace(/-/g, " ").toLowerCase() || "";

    const subCategoryMatch =
      !normalizedSub ||
      p.title.toLowerCase().includes(normalizedSub) ||
      p.description.toLowerCase().includes(normalizedSub);

    const searchMatch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const genderMatch =
      !selectGender ||
      p.category.toLowerCase().includes(selectGender);

    return (
      categoryMatch &&
      subCategoryMatch &&
      searchMatch &&
      genderMatch
    );
  });

  /* ----------------------------------
     EMPTY STATE
  -----------------------------------*/
  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-24 text-center">
        <h2 className="text-2xl font-bold">
          No products found
        </h2>
        <p className="text-gray-500 mt-2">
          Try selecting a different category
        </p>
      </div>
    );
  }

  /* ----------------------------------
     RENDER
  -----------------------------------*/
  return (
    <div className="flex flex-wrap justify-evenly text-black">
      {filteredProducts.map((item) => (
        <ProductCard
          key={item.id}
          Pid={item.id}
          title={item.title}
          src={item.image}
          description={item.description}
          price={item.price}
        />
      ))}
    </div>
  );
};

export default ProductClient;
