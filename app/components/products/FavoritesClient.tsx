"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import ProductCard from "@/components/Global/ProductCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

/**
 * 👑 LUXURY REDESIGN: Wishlist / Favorites Page (Nangalia Ruchira Theme)
 *
 * Styled for premium look:
 * - Backdrop: bg-[#fcfbfa] with spacious paddings.
 * - Header standardized: Classic uppercase tracked tagline, elegant serif titles, and minimal rectangular buttons.
 * - Filter Swatches: Delicate rectangular selectors with spaced typography.
 * - Product Grid: Crisp geometric grid columns with clean text link "Remove From Wishlist" triggers.
 */
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
    <div className="min-h-screen bg-[#fcfbfa] px-4 sm:px-6 lg:px-8 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Curated Wardrobe
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 tracking-wide uppercase">
              Your Wishlist
            </h1>
          </div>

          {/* Action button (Minimal rectangular style) */}
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="px-5 py-3 rounded-md bg-[#6A0F1F] text-white hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Plus size={12} />
              New Folder
            </button>
          ) : (
            <div className="flex gap-2.5 flex-wrap">
              <input
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
                placeholder="FOLDER NAME (E.G. SUMMER, FESTIVE)"
                className="border border-neutral-200 focus:border-neutral-800 px-4 py-2.5 rounded-md text-[10px] uppercase font-bold tracking-wider outline-none bg-white min-w-0"
                autoFocus
              />
              <button
                onClick={() => {
                  if (!newCollection.trim()) return;
                  createCollection(newCollection.trim());
                  setNewCollection("");
                  setShowInput(false);
                }}
                className="px-5 py-2.5 rounded-md bg-[#6A0F1F] text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-900 shadow-sm"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewCollection("");
                }}
                className="px-5 py-2.5 rounded-md border border-neutral-200 text-neutral-500 bg-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* CATEGORY FILTER (Minimal rectangular selectors) */}
        {hasAnyFavorites && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition cursor-pointer ${
                !selectedCategory
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                  : "bg-white border-neutral-200 hover:border-neutral-800 text-neutral-700"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                    : "bg-white border-neutral-200 hover:border-neutral-800 text-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!hasAnyFavorites && (
          <div className="text-center py-24 space-y-6">
            <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-800 uppercase tracking-wide">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed font-sans font-light">
              Start curating your personal VastraDrobe. Browse our catalogs and
              save your favorite garments here for later.
            </p>
            <div className="pt-4">
              <Link
                href="/collection"
                className="bg-[#6A0F1F] text-white hover:bg-[#4d0b18] text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-md transition inline-flex"
              >
                Explore Products →
              </Link>
            </div>
          </div>
        )}

        {/* WISHLIST FOLDERS / SECTIONS */}
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
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
              }}
              className="space-y-8 border-b border-neutral-100 pb-16 last:border-b-0 last:pb-0 scroll-mt-28"
            >
              {/* Folder header title */}
              <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-800 tracking-wide uppercase">
                {collection}
              </h2>

              {favProducts.length === 0 ? (
                <div className="text-neutral-400 text-xs font-light italic p-8 border border-neutral-100 rounded-xl bg-[#faf9f6]/40 text-center">
                  No products in this folder match your selected category
                  filter.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {favProducts.map((item) => (
                    <div key={item.productId} className="flex flex-col">
                      <ProductCard product={item} Linked>
                        {/* 🔒 FIXED ACTIONS: Swapped the bulky brown button below cards for an elegant uppercase text trigger */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCollection(collection, item.productId);
                            toast.error("Removed from wishlist");
                          }}
                          className="mt-3 text-[9px] tracking-widest font-bold uppercase text-red-600 hover:underline underline-offset-4 cursor-pointer text-center w-full block transition duration-200"
                        >
                          Remove From Folder
                        </button>
                      </ProductCard>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesClient;
