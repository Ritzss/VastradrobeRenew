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
    <div className="p-10 flex flex-col gap-10">
      <h1 className="text-3xl font-bold">Your Favorites ❤️</h1>
      CREATE COLLECTION
      <div className="flex items-center gap-4 mb-6">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-black text-white rounded-md flex gap-2"
          >
            <Plus /> New Collection
          </button>
        ) : (
          <>
            <input
              value={newCollection}
              onChange={(e) => setNewCollection(e.target.value)}
              placeholder="Collection name"
              className="border px-3 py-2 rounded-md outline-none"
            />
            <button
              onClick={() => {
                if (!newCollection.trim()) return;
                createCollection(newCollection.trim());
                setNewCollection("");
                setShowInput(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewCollection("");
              }}
              className="px-4 py-2 bg-gray-300 rounded-md"
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
          <section key={collection}>
            <h2 className="text-2xl font-semibold mb-4">{collection}</h2>

            {favProducts.length === 0 ? (
              <div className="text-gray-500 italic">
                No items in this collection yet
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {favProducts.map((item) => (
                  <ProductCard
                    key={item.productId}
                    product={item}
                    button={false}
                    classNameInner="h-[55vh]"
                  >
                    <button
                      onClick={() =>
                        removeFromCollection(collection, item.productId)
                      }
                      className="p-2 rounded-lg hover:translate-y-1 hover:rounded-xl w-full bg-[#cd0000] duration-500 transition-all text-white flex justify-center items-center gap-2 "
                    >
                      Remove Item
                    </button>
                  </ProductCard>
                  // <StarBorder
                  //   key={item.productId}
                  //   color="#cd0000"
                  //   speed="5s"
                  //   className="w-[23%] border"
                  // >
                  //   {/* <div className="relative w-[30vh] h-[40vh] overflow-hidden rounded-xl">
                  //     <Image
                  //     src={item.images?.[0] || "/Assets/Images/Newplaceholder.png"}
                  //     fill
                  //     sizes="photo"
                  //     alt={String(item.name)}
                  //     className="mx-auto h-45 object-contain"
                  //   />
                  //   </div>

                  //   <div className="mt-3 font-bold text-center line-clamp-2">
                  //     {item.name}
                  //   </div>

                  //   <div className="mt-2 font-semibold text-center">
                  //     ₹{item.price}
                  //   </div> */}

                  //   <button

                  //     className="mt-3 text-red-600 font-semibold"
                  //   >
                  //     Remove ❤️
                  //   </button>
                  // </StarBorder>
                ))}
              </div>
            )}

            <hr className="border-2 mt-6" />
          </section>
        );
      })}
      {/* CTA */}
      <div>
        <button className="text-xl w-full flex justify-center items-center gap-2">
          Add New
          <Link
            href="/"
            className="p-2 rounded bg-[#cd0000] transition-all hover:rounded-xl text-white"
          >
            Favorites
          </Link>
        </button>
      </div>
    </div>
  );
};

export default FavoritesClient;
