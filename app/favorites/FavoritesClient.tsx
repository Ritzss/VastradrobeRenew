"use client";

import { useEffect, useState } from "react";
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

  const categories = Array.from(new Set(products.map((p) => p.category)));

  useEffect(() => {
    const allIds = Array.from(
      new Set(Object.values(favCollections).flatMap((set) => Array.from(set))),
    ).join(",");

    if (!allIds) return;

    const loadProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?ids=${allIds}`,
        { cache: "no-store" },
      );

      const data = await res.json();
      setProducts(data.products || []);
    };

    loadProduct();
  }, [favCollections, setProducts]);

  return (
    <section className="w-full px-4 sm:px-6 lg:max-w-7xl lg:mx-auto py-10 flex flex-col gap-10 ">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-semibold tracking-tight"
      >
        Your Favorites
      </motion.h1>

      {/* CREATE COLLECTION */}
      <div className="flex flex-wrap items-center gap-3">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-black text-white rounded-md flex gap-2 text-sm hover:opacity-90 transition"
          >
            <Plus size={16} /> New Collection
          </button>
        ) : (
          <>
            <input
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              placeholder="Collection name"
              className="border px-3 py-2 rounded-md outline-none text-sm w-full sm:w-auto"
            />
            <button
              onClick={() => {
                if (!newCollection.trim()) return;
                createCollection(newCollection.trim());
                setNewCollection("");
                setShowInput(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:opacity-90 transition"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewCollection("");
              }}
              className="px-4 py-2 bg-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-md text-sm border ${
            !selectedCategory ? "bg-black text-white" : ""
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-sm border capitalize ${
              selectedCategory === cat ? "bg-black text-white" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* COLLECTIONS */}
      {Object.entries(favCollections).map(([collection, ids], index) => {
        const favProducts = products.filter(
          (p) =>
            ids.has(p.productId) &&
            (!selectedCategory || p.category === selectedCategory),
        );

        return (
          <motion.section
            key={collection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-xl font-semibold">{collection}</h2>

            {favProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 italic text-sm p-4 rounded-lg border"
              >
                Nothing saved here yet. Start curating your style.
              </motion.div>
            ) : (
              <div className="flex flex-wrap gap-5">
                {favProducts.map((item) => (
                  <motion.div
                    key={item.productId}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-full sm:w-[48%] lg:w-[30%]"
                  >
                    <ProductCard
                      product={item}
                      button={false}
                      height="h-[55vh]"
                      classNameInner="h-[47vh]"
                      className="w-full"
                    >
                      <button
                        onClick={() =>
                          removeFromCollection(collection, item.productId)
                        }
                        className="mt-3 px-3 py-2 w-full rounded-md bg-[#cd0000] text-white text-sm transition hover:opacity-90"
                      >
                        Remove
                      </button>
                    </ProductCard>
                  </motion.div>
                ))}
              </div>
            )}

            <hr className="border mt-6" />
          </motion.section>
        );
      })}

      {/* CTA */}
      <div className="flex justify-center pt-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-black text-white text-sm transition-all duration-300 hover:bg-white hover:text-black border border-black"
          >
            Explore More Products →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FavoritesClient;
