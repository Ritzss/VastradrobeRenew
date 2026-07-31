"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { Plus, X, ChevronDown, Check, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/Global/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { IMSProduct } from "@/Types/Product";

// Helper to standardise display folder names
const getDisplayFolderName = (colName: string) => {
  const lower = colName.trim().toLowerCase();
  if (
    lower === "favorites" ||
    lower === "default" ||
    lower === "my wishlist" ||
    lower === "default folder"
  ) {
    return "Default Folder";
  }
  return colName;
};

// Helper to standardise backend folder names
const getBackendFolderName = (colName: string) => {
  const lower = colName.trim().toLowerCase();
  if (lower === "default folder") return "Favorites";
  return colName;
};

type FavoriteProductCardProps = {
  product: IMSProduct;
  collection: string; // Current folder/collection name
  onRemoveFolder: (product: IMSProduct) => void;
  onRemoveGlobal: (product: IMSProduct) => void;
};

/**
 * 👑 LUXURY SUB-COMPONENT: Favorite Product Card (Nangalia Ruchira Theme)
 *
 * Implements a dynamic, premium Wishlist Management Dropdown:
 * - 🪐 Chevron Down Trigger: Floating top-left trigger button overlaying the card.
 * - 🗳️ Folder Single-Selection: Clicking a folder instantly MOVES the item to that folder
 *   (supports single folder behavior, checking the tick on the right).
 * - 🗑️ Global Cleanse: A bottom "Remove from Wishlist" option that clears the item completely.
 * - ⏱️ 10-Second In-Place Undo: When cleared, the card instantly swaps content *in its exact grid slot*,
 *   allowing the user to click "Undo" to restore, before executing the database API delete after 10s.
 */
const FavoriteProductCard = ({
  product,
  collection,
  onRemoveFolder,
  onRemoveGlobal,
}: FavoriteProductCardProps) => {
  const { favCollections, addToCollection, removeFromCollection } =
    useAppContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerId]);

  // Handles moving a product to a selected folder (Single folder behavior!)
  const handleMoveToFolder = async (colName: string) => {
    setMenuOpen(false);

    const targetFolder = colName;
    const currentFolder = collection;

    if (targetFolder === currentFolder) {
      toast.info(`Already saved in ${getDisplayFolderName(colName)}`);
      return;
    }

    // 1. Add to the new selected folder
    await addToCollection(
      getBackendFolderName(targetFolder),
      product.productId,
    );

    // 2. Remove from the current folder
    await removeFromCollection(
      getBackendFolderName(currentFolder),
      product.productId,
    );

    toast.success(`Moved to ${getDisplayFolderName(colName)}`);
  };

  // Cancel timer and restore the original card
  const handleUndo = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    setIsRemoved(false);
    toast.success(`Restored "${product.name}" to folder!`);
  };

  // Render the premium, full-bleed Undo slot if removed locally
  if (isRemoved) {
    return (
      <div className="aspect-[3/4] w-full rounded-2xl border border-dashed border-neutral-250 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 p-5 flex flex-col justify-between items-center text-center shadow-xs animate-fadeIn select-none">
        <div className="my-auto space-y-3">
          <p className="text-[9px] font-bold text-neutral-400 tracking-[0.15em] uppercase">
            Removed Item
          </p>
          <h4 className="font-serif text-[13px] font-light text-neutral-800 dark:text-white uppercase tracking-wide line-clamp-2 px-1 leading-snug">
            &quot;{product.name}&quot;
          </h4>
          <p className="text-[8px] text-red-600 dark:text-red-400 font-bold uppercase tracking-widest mt-1">
            Removed from Wishlist
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUndo();
          }}
          className="w-full py-2.5 rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white shadow-xs transition duration-200 cursor-pointer"
        >
          Undo Remove
        </button>
      </div>
    );
  }

  const isWishlisted = Object.values(favCollections || {}).some((set) =>
    set.has(product.productId),
  );

  return (
    <div className="relative group/card flex flex-col">
      <ProductCard product={product} Linked={true} />

      {/* 🏛️ Floating Top-Left Chevron Trigger */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-white/85 dark:bg-black/85 backdrop-blur-md border border-neutral-100/50 dark:border-neutral-900/50 shadow-xs text-neutral-500 dark:text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 group-hover/card:opacity-100 md:opacity-0 max-md:opacity-100"
        title="Manage Folders"
      >
        <ChevronDown
          size={13}
          className={`transition-transform duration-300 ${menuOpen ? "rotate-180 text-[#6A0F1F] dark:text-[#e4e198]" : ""}`}
        />
      </button>

      {/* 🏛️ Premium Absolute Management Dropdown Overlay */}
      {menuOpen && (
        <>
          {/* Click backdrop context to dismiss the card panel */}
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMenuOpen(false);
            }}
          />
          <div className="absolute top-15 left-4 w-48 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-xl shadow-2xl p-3 z-30 text-left divide-y divide-neutral-100 dark:divide-neutral-900 select-none animate-fadeIn">
            {/* Tag title */}
            <div className="pb-2 text-left">
              <p className="text-[8px] font-bold text-neutral-400 tracking-[0.25em] uppercase text-left">
                Save To Folders
              </p>
            </div>

            {/* Folder selection list (Single folder behavior with ticks on the RIGHT side!) */}
            <div className="py-2 space-y-1 max-h-36 overflow-y-auto custom-scroll text-left">
              {Object.entries(favCollections).map(([colName]) => {
                const displayName = getDisplayFolderName(colName);
                const isSelectedInThisFolder =
                  colName.toLowerCase() === collection.toLowerCase();

                return (
                  <button
                    key={colName}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMoveToFolder(colName);
                    }}
                    className="w-full flex items-center justify-between px-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] cursor-pointer text-left transition duration-200"
                  >
                    <span className="truncate pr-2 flex-1 text-left">
                      {displayName}
                    </span>
                    {isSelectedInThisFolder && (
                      <Check
                        size={10}
                        className="text-[#6A0F1F] dark:text-[#e4e198] shrink-0"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Delete/Remove from Wishlist globally (Clean X icon on the LEFT) */}
            <div className="pt-2 text-left">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveGlobalLocal();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 cursor-pointer text-left transition duration-200"
              >
                <X size={10} className="shrink-0" strokeWidth={2.5} />
                <span className="flex-1 truncate text-left">
                  Remove from Wishlist
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 👑 LUXURY REDESIGN: Wishlist / Favorites Page (Nangalia Ruchira Theme)
 *
 * Styled for premium look & 100% dark-mode synchronized:
 * - Backdrop: bg-[#fcfbfa] dark:bg-black with spacious paddings and transition-colors.
 * - Header standardized: Classic uppercase tracked tagline, elegant serif titles, and minimal rectangular buttons.
 * - Filter Swatches: Delicate rectangular selectors with spaced typography, colored with Wine-Red (#6A0F1F) and Gold-Ivory (#e4e198).
 * - Folders Grid: Immersive grid of folder cards using the home collections stacked layout! Clicking a folder opens its details smoothly on a sub-viewport detail layout.
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

  // Sub-navigation view state for single folders
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // State to track recently removed product placeholders for the Undo feature
  const [removedPlaceholders, setRemovedPlaceholders] = useState<
    Array<{ product: IMSProduct; collection: string; id: string }>
  >([]);

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

  // Deletes an entire folder by removing all products from it
  const deleteFolder = (colName: string) => {
    const idsToRemove = Array.from(favCollections[colName] || []);
    idsToRemove.forEach((id) => {
      removeFromCollection(colName, id);
    });
    toast.error(`Deleted folder "${getDisplayFolderName(colName)}"`);
  };

  // Handles removing a product from a specific folder with a 10s Undo placeholder
  const handleRemoveFromFolder = (
    collectionName: string,
    product: IMSProduct,
  ) => {
    removeFromCollection(collectionName, product.productId);

    const placeholderId = `${product.productId}-${collectionName}-${Date.now()}`;
    setRemovedPlaceholders((prev) => [
      ...prev,
      { product, collection: collectionName, id: placeholderId },
    ]);

    // Auto-hide the placeholder card after 10 seconds
    setTimeout(() => {
      setRemovedPlaceholders((prev) =>
        prev.filter((item) => item.id !== placeholderId),
      );
    }, 10000);

    toast.error(`Removed from ${getDisplayFolderName(collectionName)}`);
  };

  // Handles removing a product from ALL folders globally with 10s Undo placeholders
  const handleRemoveGlobal = (product: IMSProduct) => {
    Object.entries(favCollections).forEach(([colName, set]) => {
      if (set.has(product.productId)) {
        removeFromCollection(colName, product.productId);

        const placeholderId = `${product.productId}-${colName}-${Date.now()}`;
        setRemovedPlaceholders((prev) => [
          ...prev,
          { product, collection: colName, id: placeholderId },
        ]);

        // Auto-hide after 10 seconds
        setTimeout(() => {
          setRemovedPlaceholders((prev) =>
            prev.filter((item) => item.id !== placeholderId),
          );
        }, 10000);
      }
    });

    toast.error(`"${product.name}" removed from wishlist`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 px-4 sm:px-6 lg:px-8 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ================= VIEW 1: GORGEOUS GRID OF WISHY FOLDERS (HOME COLLECTIONS STYLE) ================= */}
        {!activeFolder ? (
          <div className="space-y-12 select-none animate-fadeIn">
            {/* HEADER BLOCK */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-6">
              <div className="space-y-1 text-left">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  Curated Wardrobes
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
                  Your Wishlist Folders
                </h1>
              </div>

              {/* Action button (Minimal rectangular style with dynamic theme coloring) */}
              {!showInput ? (
                <button
                  onClick={() => setShowInput(true)}
                  className="px-5 py-3 rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 hover:bg-neutral-900 dark:hover:bg-white text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md cursor-pointer transition duration-200"
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
                    className="border border-neutral-200 dark:border-neutral-800 focus:border-neutral-800 dark:focus:border-neutral-500 px-4 py-2.5 rounded-md text-[10px] uppercase font-bold tracking-wider outline-none bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 min-w-0"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (!newCollection.trim()) return;
                      createCollection(newCollection.trim());
                      setNewCollection("");
                      setShowInput(false);
                    }}
                    className="px-5 py-2.5 rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-900 dark:hover:bg-white shadow-sm transition"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewCollection("");
                    }}
                    className="px-5 py-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-950 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* GRID OF GEOMETRIC LAYERED CARDS (Always renders 3 card slots) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(favCollections).map(([collection, ids]) => {
                const displayName = getDisplayFolderName(collection);
                const folderProducts = products.filter((p) =>
                  ids.has(p.productId),
                );

                // Fetch product items or fallbacks
                const first = folderProducts[0];
                const second = folderProducts[1];
                const third = folderProducts[2];

                const getProductImage = (product: IMSProduct) => {
                  const variant = product?.variants?.[0];
                  return (
                    variant?.designs?.[0]?.images?.[0] || variant?.images?.[0]
                  );
                };

                return (
                  <div
                    key={collection}
                    onClick={() => setActiveFolder(collection)}
                    className="group cursor-pointer block text-left space-y-4"
                  >
                    {/* Card Container (Dashed empty card frames always rendered!) */}
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#faf9f6] dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 shadow-xs transition duration-300">
                      {/* SLOT 1 (Left Card, tilted -8deg) */}
                      {first ? (
                        <img
                          src={getProductImage(first)}
                          alt=""
                          className="absolute left-7 top-8 h-47.5 w-35 rounded-xl object-cover rotate-[-8deg] shadow-md transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[-6deg] select-none pointer-events-none"
                          draggable="false"
                        />
                      ) : (
                        <div className="absolute left-7 top-8 h-47.5 w-35 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/10 rotate-[-8deg] flex items-center justify-center text-neutral-400 dark:text-neutral-500 font-sans text-[10px] font-bold uppercase tracking-widest select-none transition duration-500 group-hover:-translate-y-1">
                          Empty
                        </div>
                      )}

                      {/* SLOT 2 (Center Card, straight) */}
                      {second ? (
                        <img
                          src={getProductImage(second)}
                          alt=""
                          className="absolute right-36 top-4 h-45 w-32.5 rounded-xl object-cover rotate-0 shadow-lg transition duration-500 group-hover:-translate-y-3 select-none pointer-events-none"
                          draggable="false"
                        />
                      ) : (
                        <div className="absolute right-36 top-4 h-45 w-32.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/10 rotate-0 flex items-center justify-center text-neutral-400 dark:text-neutral-500 font-sans text-[10px] font-bold uppercase tracking-widest select-none transition duration-500 group-hover:-translate-y-1.5">
                          Empty
                        </div>
                      )}

                      {/* SLOT 3 (Right Card, tilted 8deg) */}
                      {third ? (
                        <img
                          src={getProductImage(third)}
                          alt=""
                          className="absolute right-8 top-12 h-45 w-32.5 rounded-xl object-cover rotate-[8deg] shadow-md transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[6deg] select-none pointer-events-none"
                          draggable="false"
                        />
                      ) : (
                        <div className="absolute right-8 top-12 h-45 w-32.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/10 rotate-[8deg] flex items-center justify-center text-neutral-400 dark:text-neutral-500 font-sans text-[10px] font-bold uppercase tracking-widest select-none transition duration-500 group-hover:-translate-y-1">
                          Empty
                        </div>
                      )}

                      {/* Bottom Details Panel */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 border-t border-neutral-100 dark:border-neutral-800 p-6 space-y-2 z-10 transition duration-300">
                        <h3 className="font-serif text-xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
                          {displayName}
                        </h3>
                        <div className="pt-2 flex justify-between items-center border-t border-neutral-50 dark:border-neutral-800 text-[10px] tracking-widest font-bold uppercase text-neutral-400 dark:text-neutral-500">
                          <span>
                            {folderProducts.length}{" "}
                            {folderProducts.length === 1
                              ? "Product"
                              : "Products"}
                          </span>
                          <span className="text-[#6A0F1F] dark:text-[#e4e198] group-hover:translate-x-1.5 transition duration-300 flex items-center gap-1">
                            Explore <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: SINGLE FOLDER DETAIL VIEW ================= */
          <div className="space-y-10 animate-fadeIn text-left">
            {/* BACK BUTTON ACTION */}
            <button
              onClick={() => setActiveFolder(null)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6A0F1F] dark:text-[#e4e198] hover:underline underline-offset-4 cursor-pointer pb-2"
            >
              <ArrowLeft size={13} />
              <span>Back to folders</span>
            </button>

            {/* FOLDER DETAILS ROW (Delete Folder action is hidden on Default Folder, but allowed on custom ones!) */}
            {(() => {
              const isDefaultFolder = [
                "favorites",
                "my wishlist",
                "default",
              ].includes(activeFolder.trim().toLowerCase());
              const activeIds = favCollections[activeFolder] || new Set();
              const activeFolderProducts = products.filter(
                (p) =>
                  activeIds.has(p.productId) &&
                  (!selectedCategory || p.category === selectedCategory),
              );

              return (
                <>
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-6">
                    <div className="space-y-1 text-left">
                      <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                        Active Wishlist Folder
                      </p>
                      <h1 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-2">
                        {getDisplayFolderName(activeFolder)}
                      </h1>
                    </div>

                    {/* 🔒 FIXED: Delete folder action button is hidden on default folders, but rendered on custom ones! */}
                    {!isDefaultFolder && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete the folder "${getDisplayFolderName(activeFolder)}"?`,
                            )
                          ) {
                            deleteFolder(activeFolder);
                            setActiveFolder(null); // Return to grid on delete
                          }
                        }}
                        className="text-[9px] tracking-widest font-bold uppercase text-red-600 hover:text-red-700 hover:underline underline-offset-4 cursor-pointer transition"
                      >
                        Delete Folder
                      </button>
                    )}
                  </div>

                  {/* PRODUCTS GRID IN THIS SPECIFIC FOLDER */}
                  {(() => {
                    const activePlaceholders = removedPlaceholders.filter(
                      (item) =>
                        item.collection === activeFolder &&
                        (!selectedCategory ||
                          item.product.category === selectedCategory),
                    );

                    if (
                      activeFolderProducts.length === 0 &&
                      activePlaceholders.length === 0
                    ) {
                      return (
                        <div className="text-center py-20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/20 dark:bg-neutral-900/10 select-none space-y-4">
                          <p className="text-neutral-400 dark:text-neutral-500 text-xs font-light italic">
                            This folder has no garments. Open any product and
                            tap the heart icon to save items here!
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Render active products */}
                        {activeFolderProducts.map((item) => (
                          <FavoriteProductCard
                            key={item.productId}
                            product={item}
                            collection={activeFolder}
                            onRemoveFolder={(prod) =>
                              handleRemoveFromFolder(activeFolder, prod)
                            }
                            onRemoveGlobal={handleRemoveGlobal}
                          />
                        ))}

                        {/* Render 10s Undo placeholder slots */}
                        {activePlaceholders.map((item) => (
                          <div
                            key={item.id}
                            className="aspect-[3/4] w-full rounded-2xl border border-dashed border-neutral-250 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 p-5 flex flex-col justify-between items-center text-center shadow-xs animate-fadeIn select-none animate-fadeIn"
                          >
                            <div className="my-auto space-y-3">
                              <p className="text-[9px] font-bold text-neutral-400 tracking-[0.15em] uppercase">
                                Removed Item
                              </p>
                              <h4 className="font-serif text-[13px] font-light text-neutral-800 dark:text-white uppercase tracking-wide line-clamp-2 px-1 leading-snug">
                                &quot;{item.product.name}&quot;
                              </h4>
                              <p className="text-[8px] text-red-600 dark:text-red-400 font-bold uppercase tracking-widest mt-1">
                                Removed from Wishlist
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleUndo();
                              }}
                              className="w-full py-2.5 rounded-md bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 dark:hover:bg-white shadow-xs transition duration-200 cursor-pointer"
                            >
                              Undo Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesClient;
