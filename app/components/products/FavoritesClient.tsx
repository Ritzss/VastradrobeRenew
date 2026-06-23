"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductCard from "@/components/Global/ProductCard";
import { motion } from "framer-motion";

const FavoritesClient = () => {
  const {
    favCollections,
    products,
    setProducts,
    createCollection,
    removeFromCollection,
  } = useAppContext();

  const [newCollection, setNewCollection] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  useEffect(() => {
    const allIds = Array.from(
      new Set(Object.values(favCollections).flatMap((set) => Array.from(set))),
    ).join(",");

    if (!allIds) return;

    const loadProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?ids=${allIds}`,
      );
      const data = await res.json();
      setProducts(data.products || []);
    };

    loadProduct();
  }, [favCollections, setProducts]);

  const hasAnyFavorites = Object.values(favCollections).some(
    (set) => set.size > 0,
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 space-y-16 pt-28 bg-[#f9f5ef] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-[#5f5143]">
          Your Favorites
        </h1>

        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="  flex items-center gap-2  px-5 py-2  rounded-full  bg-[#5f5143]  text-white  text-sm  hover:bg-[#6a0f1f]  transition"
          >
            <Plus size={16} />
            New Collection
          </button>
        ) : (
          <div className="flex gap-3 flex-wrap">
            <input
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              placeholder="Collection name"
              className=" border border-[#e6d8c8] px-4 py-2 rounded-full text-sm outline-none focus:border-[#5f5143]"
            />
            <button
              onClick={() => {
                if (!newCollection.trim()) return;
                createCollection(newCollection.trim());
                setNewCollection("");
                setShowInput(false);
              }}
              className=" px-4 py-2 rounded-full bg-[#5f5143] text-white text-sm hover:bg-[#6a0f1f] transition"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewCollection("");
              }}
              className=" px-4 py-2 rounded-full bg-[#e6d8c8] text-[#5f5143] text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`
            px-4 py-2 rounded-full text-sm border border-[#e6d8c8]
            ${
              !selectedCategory
                ? "bg-[#5f5143] text-white border-[#5f5143]"
                : "text-[#5f5143] hover:bg-[#f3e7d8]"
            }
          `}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-4 py-2 rounded-full text-sm capitalize border border-[#e6d8c8]
              ${
                selectedCategory === cat
                  ? "bg-[#5f5143] text-white border-[#5f5143]"
                  : "text-[#5f5143] hover:bg-[#f3e7d8]"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!hasAnyFavorites && (
        <div className="text-center py-28 space-y-6">
          <h2 className="text-2xl font-medium text-[#5f5143]">
            Nothing saved yet
          </h2>
          <p className="text-[#7a6a5c] max-w-md mx-auto">
            Start curating your personal style. Your saved pieces will appear
            here.
          </p>
          <Link
            href="/"
            className=" inline-block mt-4 px-6 py-3 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition"
          >
            Explore Products →
          </Link>
        </div>
      )}

      {/* COLLECTIONS */}
      {Object.entries(favCollections).map(([collection, ids], index) => {
        const favProducts = products.filter(
          (p) =>
            ids.has(p.productId) &&
            (!selectedCategory || p.category === selectedCategory),
        );

        if (!ids.size) return null;

        return (
          <motion.section
            key={collection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
            }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold text-[#5f5143]">
              {collection}
            </h2>

            {favProducts.length === 0 ? (
              <div className="text-[#957f6a] italic text-sm p-6 border border-[#e6d8c8] rounded-xl bg-white">
                No products match this category.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {favProducts.map((item) => (
                  <motion.div
                    key={item.productId}
                    whileHover={{ y: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <ProductCard product={item} Linked>
                      <button
                        onClick={() =>
                          removeFromCollection(collection, item.productId)
                        }
                        className=" mt-4 w-full py-2 rounded-full bg-[#5f5143] text-white text-sm hover:bg-[#6a0f1f] transition"
                      >
                        Remove
                      </button>
                    </ProductCard>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="border-t border-[#e6d8c8] pt-8" />
          </motion.section>
        );
      })}
    </section>
  );
};

export default FavoritesClient;
