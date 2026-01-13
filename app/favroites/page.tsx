"use client";

import { useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import StarBorder from "@/components/UI/StarBorder";
import Link from "next/link";

const FavoritesPage = () => {
  const { favCollections, products, createCollection, removeFromCollection } = useAppContext();
  const [newCollection, setNewCollection] = useState("");
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="p-10 flex flex-col gap-10">
      <h1 className="text-3xl font-bold">Your Favorites ❤️</h1>
      <div className="flex items-center gap-4 mb-6">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            ➕ New Collection
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

      {Object.entries(favCollections).map(([collection, ids]) => {
        const favProducts = products.filter((p) => ids.has(p.id));

        if (favProducts.length === 0) return null;

        return (
          <section key={collection}>
            <h2 className="text-2xl font-semibold mb-4">{collection}</h2>

            <div className="flex flex-wrap gap-6">
              {favProducts.map((item) => (
                <StarBorder
                  key={item.id}
                  color="#ffffff"
                  speed="5s"
                  className="w-[23%] p-4 rounded-2xl flex flex-col justify-between h-105"
                >
                  <Image
                    src={item.image}
                    width={150}
                    height={150}
                    alt={item.title}
                    className="mx-auto h-45 object-contain"
                  />

                  <div className="mt-3 font-bold text-center line-clamp-2 min-h-12">
                    {item.title}
                  </div>

                  <div className="mt-2 font-semibold text-center">
                    ₹{(item.price)*100}
                  </div>

                  <button
                    onClick={() => removeFromCollection(collection, item.id)}
                    className="mt-3 text-red-600 font-semibold"
                  >
                    Remove ❤️
                  </button>
                </StarBorder>
              ))}
            </div>
            <hr className="border-2"/>
          </section>
        );
      })}
      <div>
        <button className="text-xl w-full flex justify-center items-center gap-2">Return to <Link href={'/'} className="p-2 rounded bg-[#cd0000] text-white hover:shadow-[inset_0_0_10px_#000000]">Home</Link></button>
      </div>
    </div>
  );
};

export default FavoritesPage;
