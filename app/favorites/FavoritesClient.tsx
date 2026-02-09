"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductCard from "@/components/Global/ProductCard";

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
    <section
      className="w-full px-3 sm:px-4 md:px-6 lg:max-w-7xl lg:mx-auto py-6 md:py-10 flex flex-col gap-8"
    >
      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
        Your Favorites ❤️
      </h1>

      {/* CREATE COLLECTION */}
      <div className="flex flex-wrap items-center gap-3">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-black text-white rounded-md flex gap-2 text-sm"
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
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
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

      {/* COLLECTIONS */}
      {Object.entries(favCollections).map(([collection, ids]) => {
        const favProducts = products.filter((p) => ids.has(p.productId));

        return (
          <section key={collection} className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {collection}
            </h2>

            {favProducts.length === 0 ? (
              <div className="text-gray-500 italic text-sm">
                No items in this collection yet
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {favProducts.map((item) => (
                  <div
                    key={item.productId}
                    className=" w-full sm:w-[32%] md:w-[48%] lg:w-[30%]"
                  >
                    <ProductCard product={item} button={false} className="sm:w-full md:w-full lg:w-[90%]">
                      <button
                        onClick={() =>
                          removeFromCollection(collection, item.productId)
                        }
                        className="mt-2 px-3 py-2 w-full rounded-md bg-[#cd0000] text-white text-sm transition hover:opacity-9"
                      >
                        Remove
                      </button>
                    </ProductCard>
                  </div>
                ))}
              </div>
            )}

            <hr className="border mt-6" />
          </section>
        );
      })}

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/"
          className=" flex items-center gap-2 px-4 py-2 rounded-md bg-[#cd0000] text-white text-sm hover:opacity-90"
        >
          Add more favorites
        </Link>
      </div>
    </section>
  );
};

export default FavoritesClient;
