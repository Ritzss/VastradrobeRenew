/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Image from "next/image";
// import Link from "next/link";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
// import { useState } from "react";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";
import { createSlug } from "@/lib/slug";
// import { Heart } from "lucide-react";
// import { RiHeartFill } from "react-icons/ri";

type Props = {
  product: IMSProduct;
  className?: string;
  children?: React.ReactNode;
  Linked: boolean;
};

export default function ProductCard({
  product,
  className,
  children,
  Linked,
}: Props) {
  const productId = Number(product.productId);
  const { name, variants, price } = product;

  const { cartItems, addToCart, removeFromCart } = useAppContext();

  const firstVariant = variants?.[0];
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

  // const [selectedCollection, setSelectedCollection] = useState<string | null>(
  //   null,
  // );

  const handleCartToggle = () => {
    if (!defaultColor) return;

    isInCart
      ? removeFromCart(productId, defaultSize, defaultColor)
      : addToCart(productId, defaultSize, defaultColor);
  };

  // const handleWishlist = () => {
  //   const collectionNames = Object.keys(favCollections);

  //   if (selectedCollection) {
  //     removeFromCollection(selectedCollection, productId);
  //     setSelectedCollection(null);
  //     return;
  //   }

  //   if (collectionNames.length > 0) {
  //     const defaultCollection = collectionNames[0];
  //     addToCollection(defaultCollection, productId);
  //     setSelectedCollection(defaultCollection);
  //   }
  // };

  return (
    <div className={`group flex flex-col ${className ?? ""}`}>
      {/* IMAGE BLOCK */}
      <div className="relative aspect-3/4 w-full rounded-4xl overflow-hidden bg-[#f5f1e7]">
        {Linked && (
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
          >
            <Image
              src={imageSrc}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              alt={name}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {/* Badge */}
            {(product?.stock ?? 0) <= 0 && (
              <div className="absolute top-3 left-3 z-20">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                  Sold Out
                </span>
              </div>
            )}
            {/* Overlay */}
            {(product?.stock ?? 0) <= 0 && (
              <div className="absolute inset-0 bg-neutral-950/15 z-10" />
            )}
          </Link>
        )}

        {!Linked && (
          // <Link href={`/product/${productId}`}>
          <>
            <Image
              src={imageSrc}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              alt={name}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badge */}
            {(product?.stock ?? 0) <= 0 && (
              <div className="absolute top-3 left-3 z-20">
                <span className="rounded-full bg-red-600 shadow-[0_0_15px_#ff0000] px-3 py-1 text-xs font-medium text-white">
                  Sold Out
                </span>
              </div>
            )}
            {/* Overlay */}
            {(product?.stock ?? 0) <= 0 && (
              <div className="absolute inset-0 bg-neutral-950/15 z-10" />
            )}
          </>
          // </Link>
        )}

        {/* Wishlist */}
        {/* <button
          onClick={handleWishlist}
          className=" absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white transition"
        >
          {selectedCollection ? (
            <RiHeartFill size={18} className="text-red-500" />
          ) : (
            <Heart size={18} />
          )}
        </button> */}

        {/* Hover Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 dark:bg-neutral-950/85 not-dark:bg-white/90 backdrop-blur translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4">
          {(product?.stock ?? 0) > 0 ? (
            <button
              onClick={handleCartToggle}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white py-2 text-white"
            >
              <span className="absolute -left-10 top-0 h-full w-[140%] -translate-x-full -skew-x-12 bg-[#6a0f1f] transition-transform duration-500 ease-out group-hover:translate-x-0" />

              <span className="relative z-10 flex items-center gap-2">
                {isInCart ? (
                  <>
                    <MdOutlineRemoveShoppingCart />
                    Remove
                  </>
                ) : (
                  <>
                    <FaCartArrowDown />
                    Add to Cart
                  </>
                )}
              </span>
            </button>
          ) : (
            <button
              onClick={() =>
                toast.success("You'll be notified when this item is restocked")
              }
              className="w-full py-2 rounded-full bg-neutral-700 text-white flex items-center justify-center"
            >
              Notify Me When Available
            </button>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-4 text-center">
        <p
          title={name}
          className="text-[14px] font-medium text-[#5f5143] line-clamp-2"
        >
          {name}
        </p>

        {price && <p className="mt-1 text-[13px] text-[#957f6a]">₹{price}</p>}
      </div>

      {children}
    </div>
  );
}
