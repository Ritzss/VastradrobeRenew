/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { ShoppingBag, Heart, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSlug } from "@/lib/slug";
import { useState, useEffect, useRef, useMemo } from "react";

type ProductCardProps = {
  product: IMSProduct;
  className?: string;
  classNameInner?: string;
  latest?: boolean; // Displays the elegant "NEW" badge tag
  Linked?: boolean; // If true (default), wraps card in a PDP link. If false, handles click events
  children?: React.ReactNode;
};

/**
 * 👑 UNIFIED CENTRAL COMPONENT: Product Card (Nangalia Ruchira Theme)
 *
 * Sizing & Actions Configuration:
 * - 🖥️ Desktop: Slides up a gorgeous, minimal "ADD TO BAG" overlay.
 * - 📱 Mobile / Touch Screens (No hover): Automatically displays a permanently visible bottom CTA button.
 * - 💖 Heart Button (Dual-Interactive modes):
 *   * On PC: Clicking opens an absolute folders dropdown list popup.
 *   * On Mobile: Tapping immediately toggles the item; holding (600ms) triggers the folders popup!
 *   * Logged out: Automatically saves to localStorage pending list, which hydrates right after login!
 *   * Single-folder rule enforced (moving removes it from previous collection folder).
 */
export default function ProductCard({
  product,
  className,
  classNameInner,
  latest,
  Linked = true,
  children,
}: ProductCardProps) {
  const productId = Number(product.productId);
  const { name, variants, price } = product;
  const router = useRouter();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    favCollections,
    addToCollection,
    removeFromCollection,
    user,
  } = useAppContext();

  const [foldersOpen, setFoldersOpen] = useState(false);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clean touch timers on unmount
  useEffect(() => {
    return () => {
      if (touchTimer) clearTimeout(touchTimer);
    };
  }, [touchTimer]);

  // Click-away / Touch-away listener to prevent stuck scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        foldersOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFoldersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside as EventListener);
    document.addEventListener(
      "touchstart",
      handleClickOutside as EventListener,
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener,
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener,
      );
    };
  }, [foldersOpen]);

  // Check if product is in any wishlist/favorite collection
  const isWishlisted = Object.values(favCollections || {}).some((set) =>
    set.has(productId),
  );

  // Finds which folder currently contains this product (for single folder behavior!)
  const currentProductFolder = useMemo(() => {
    return (
      Object.entries(favCollections || {}).find(([_, set]) =>
        set.has(productId),
      )?.[0] || null
    );
  }, [favCollections, productId]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔒 SECURITY CHECK: If user is logged out, redirect them to the login screen
    if (!user) {
      toast.error("Please login to save items to your wishlist");
      localStorage.setItem("pendingFavoriteProductId", String(productId));
      router.push("/account/login");
      return;
    }

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      // Mobile tap: immediately toggle favorite in default folder
      if (isWishlisted) {
        if (currentProductFolder) {
          removeFromCollection(currentProductFolder, productId);
          toast.success("Removed from Wishlist");
        }
      } else {
        const collectionNames = Object.keys(favCollections || {});
        const defaultCollection =
          collectionNames.length > 0 ? collectionNames[0] : "Favorites";
        addToCollection(defaultCollection, productId);
        toast.success("Saved in Default Folder");
      }
    } else {
      // PC click: open folders select popup list
      setFoldersOpen(!foldersOpen);
    }
  };

  // Handles moving a product to a selected folder (Single folder behavior!)
  const handleMoveToFolder = async (colName: string) => {
    setFoldersOpen(false);

    const targetFolder = colName;
    const currentFolder = currentProductFolder;

    if (
      currentFolder &&
      currentFolder.toLowerCase() === targetFolder.toLowerCase()
    ) {
      toast.info(
        `Already saved in ${colName === "Favorites" ? "Default Folder" : colName}`,
      );
      return;
    }

    // 1. Add to the new selected folder
    await addToCollection(targetFolder, productId);

    // 2. Remove from the current folder (if it exists)
    if (currentFolder) {
      await removeFromCollection(currentFolder, productId);
    }

    toast.success(
      `Moved to ${colName === "Favorites" ? "Default Folder" : colName}`,
    );
  };

  // Handles clearing a product from all folders globally
  const handleRemoveGlobal = async () => {
    setFoldersOpen(false);
    Object.keys(favCollections || {}).forEach((colName) => {
      if (favCollections[colName].has(productId)) {
        removeFromCollection(colName, productId);
      }
    });
    toast.error("Removed from wishlist");
  };

  // Mobile Long-Press gesture controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const timer = setTimeout(() => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        toast.error("Please login to save items to your wishlist");
        localStorage.setItem("pendingFavoriteProductId", String(productId));
        router.push("/account/login");
        return;
      }

      setFoldersOpen(true);
      toast.info("Select a wishlist folder to save");
    }, 600); // 600ms hold duration
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
  };

  const firstVariant = variants?.[0];
  const firstDesign = firstVariant?.designs?.[0];

  const imageSrc =
    firstDesign?.images?.[0] ||
    firstVariant?.images?.[0] ||
    "/Assets/Images/Newplaceholder.png";

  const defaultSize =
    firstDesign?.sizes?.[0] || firstVariant?.sizes?.[0] || "FREE";
  const defaultColor = firstVariant?.color || null;
  const defaultDesign = firstDesign?.design || "";

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === defaultSize &&
      item.color === defaultColor &&
      item.design === defaultDesign,
  );

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultColor) return;

    // Product cards don't have a design selector.
    // If the displayed variant has a design, use that design.
    // Products without designs simply use an empty string.
    const design = firstDesign?.design || "";

    if (isInCart) {
      removeFromCart(productId, defaultSize, defaultColor, design);
    } else {
      addToCart(productId, defaultSize, defaultColor, design);
    }
  };

  const cardContent = (
    <div
      className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#faf9f6] border border-neutral-100/50 shadow-xs ${classNameInner ?? ""}`}
    >
      {/* Immersive Image */}
      <Image
        src={imageSrc}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        alt={name}
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
        priority={false}
        draggable={false}
      />

      {/* 💖 Wishlist Heart Button (Floating Top-Right) */}
      <div ref={dropdownRef} className="absolute top-4 right-4 z-30">
        <button
          onClick={handleWishlistToggle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="p-2.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-100/50 dark:border-neutral-900/50 shadow-xs hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group/heart"
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            className={`transition-all duration-300 ${
              isWishlisted
                ? "fill-red-600 text-red-600 scale-105"
                : "text-neutral-600 dark:text-neutral-400 group-hover/heart:text-red-600 group-hover/heart:scale-105"
            }`}
          />
        </button>

        {/* 🗳️ Folder Selection List Dropdown Overlay */}
        {foldersOpen && (
          <div className="absolute right-0 top-11 w-48 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-xl shadow-2xl p-3 z-50 text-left divide-y divide-neutral-100 dark:divide-neutral-900 select-none animate-fadeIn">
            <div className="pb-2 text-left">
              <p className="text-[8px] font-bold text-neutral-400 tracking-[0.25em] uppercase text-left">
                Save To Folders
              </p>
            </div>

            <div className="py-2 space-y-1 max-h-36 overflow-y-auto custom-scroll text-left">
              {Object.entries(favCollections || {}).map(([colName]) => {
                const displayName =
                  colName.trim().toLowerCase() === "favorites"
                    ? "Default Folder"
                    : colName;
                const isSelectedInThisFolder =
                  currentProductFolder &&
                  colName.toLowerCase() === currentProductFolder.toLowerCase();

                return (
                  <button
                    key={colName}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMoveToFolder(colName);
                    }}
                    className="w-full flex items-center justify-between px-1.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] cursor-pointer text-left transition duration-200"
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

            {/* Global Delete option (Only rendered if currently wishlisted!) */}
            {isWishlisted && (
              <div className="pt-2 text-left">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveGlobal();
                  }}
                  className="w-full flex items-center gap-2 px-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 cursor-pointer text-left transition duration-200"
                >
                  <X size={10} className="shrink-0" strokeWidth={2.5} />
                  <span className="flex-1 truncate text-left">
                    Remove from Wishlist
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Badges Overlay */}
      {latest && (
        <div className="absolute top-4 left-4 z-20">
          <span className="rounded-full bg-[#6A0F1F] px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white shadow-md">
            NEW
          </span>
        </div>
      )}

      {(product?.stock ?? 0) <= 0 && (
        <>
          <div className="absolute top-4 left-4 z-20">
            <span className="rounded-full bg-neutral-900/90 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white shadow-md">
              Sold Out
            </span>
          </div>
          <div className="absolute inset-0 bg-neutral-900/10 z-10" />
        </>
      )}

      {/* 🖥️ DESKTOP-ONLY: Quick Add Slide-Up Panel (Hidden on Mobile) */}
      <div className="hidden md:flex absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-4 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-20 justify-center">
        {(product?.stock ?? 0) > 0 ? (
          <button
            onClick={handleCartToggle}
            className={`w-full py-3 px-5 rounded-xl text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center gap-2 shadow-lg transition duration-200 cursor-pointer ${
              isInCart
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#6A0F1F] text-white hover:bg-neutral-900 border"
            }`}
          >
            <ShoppingBag size={13} strokeWidth={2} />
            <span>{isInCart ? "Remove from Bag" : "Add to Bag"}</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success(
                "You will be notified as soon as this item is restocked!",
              );
            }}
            className="w-full py-3 px-5 rounded-xl bg-neutral-900/95 text-white text-[10px] tracking-widest uppercase font-semibold flex items-center justify-center shadow-lg transition hover:bg-black cursor-pointer"
          >
            Restock Notify
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`group flex flex-col ${className ?? ""}`}>
      {Linked ? (
        <Link
          href={{
            pathname: `/${product.category.toLowerCase()}/${createSlug(
              product.name,
              product.productId,
            )}`,
            query: {
              color: product.variants[0].color,
            },
          }}
          className="flex flex-col"
        >
          {cardContent}
        </Link>
      ) : (
        <div className="flex flex-col">{cardContent}</div>
      )}

      {/* BRAND & PRICING DETAILS */}
      <div className="mt-4 text-center space-y-1">
        <h3
          title={name}
          className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest line-clamp-1 px-2"
        >
          {name}
        </h3>

        {price && (
          <p className="font-serif text-[12px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
            ₹{price}
          </p>
        )}
      </div>

      {/* 📱 MOBILE-ONLY permanently visible CTA button (Hidden on Desktop) */}
      <div className="block md:hidden px-2 mt-3 z-30">
        {(product?.stock ?? 0) > 0 ? (
          <button
            onClick={handleCartToggle}
            className={`w-full py-2.5 rounded-xl text-[10px] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer ${
              isInCart ? "bg-red-600 text-white" : "bg-[#6A0F1F] text-white"
            }`}
          >
            <ShoppingBag size={11} strokeWidth={2} />
            <span>{isInCart ? "Remove" : "Add to Bag"}</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success(
                "You will be notified as soon as this item is restocked!",
              );
            }}
            className="w-full py-2.5 rounded-xl bg-neutral-800 text-white text-[9px] tracking-widest uppercase font-bold flex items-center justify-center cursor-pointer"
          >
            Restock Notify
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
