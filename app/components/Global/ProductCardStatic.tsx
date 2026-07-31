"use client";

import Image from "next/image";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

type Props = {
  product: IMSProduct;
  className?: string;
  classNameInner?: string;
  latest?: boolean;
  text: string;
  children?: React.ReactNode;
};

/**
 * 👑 LUXURY REDESIGN: Product Card Static (Nangalia Ruchira Theme)
 *
 * Optimized Responsive Sizing & Actions:
 * - Connected directly to React Context (useAppContext) so that products in our carousels
 *   can be instantly added to or removed from the shopping bag with 1 click!
 * - 🖥️ Desktop: Keeps the sleek, clutter-free slide-up "ADD TO BAG" overlay on hover.
 * - 📱 Mobile / Touch Screens: Renders a permanently visible bottom CTA button for easy 1-tap checkout.
 */
export default function ProductCardStatic({
  product,
  className,
  classNameInner,
  text,
  latest,
  children,
}: Props) {
  const productId = Number(product.productId);
  const { cartItems, addToCart, removeFromCart } = useAppContext();

  const firstVariant = product.variants?.[0];
  const firstDesign = firstVariant?.designs?.[0];

  const imageSrc =
    firstDesign?.images?.[0] ||
    firstVariant?.images?.[0] ||
    "/Assets/Images/Newplaceholder.png";

  const defaultSize =
    firstDesign?.sizes?.[0] || firstVariant?.sizes?.[0] || "FREE";
  const defaultColor = firstVariant?.color || null;

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === defaultSize &&
      item.color === defaultColor,
  );

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultColor) return;

    isInCart
      ? removeFromCart(productId, defaultSize, defaultColor)
      : addToCart(productId, defaultSize, defaultColor);
  };

  return (
    <div className={`flex flex-col group ${className ?? ""}`}>
      <Link
        title={product.name}
        href={`/product/${product.productId}`}
        className="flex flex-col w-full"
      >
        {/* Aspect Ratio Box with smooth zoom */}
        <div
          className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#faf9f6] border border-neutral-100/50 shadow-xs ${classNameInner ?? ""}`}
        >
          {latest && (
            <div className="absolute top-4 left-4 z-20">
              <span className="rounded-full bg-[#6A0F1F] px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-white shadow-md">
                NEW
              </span>
            </div>
          )}

          <Image
            src={imageSrc}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            alt={product.name}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Out of Stock Badges */}
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

          {/* 🔒 FIXED DESKTOP CAROUSEL ACTIONS: Added the sliding "Add to Bag" drawer on desktop hover for static cards as well */}
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
      </Link>

      {/* TYPOGRAPHY */}
      <div className="mt-4 text-center space-y-1">
        <h3
          title={product.name}
          className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest line-clamp-1 px-2"
        >
          {product.name}
        </h3>

        {product.price && (
          <p className="font-serif text-[12px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
            ₹{product.price}
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
