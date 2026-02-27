/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Image from "next/image";
import { FaCartArrowDown } from "react-icons/fa6";
import { useAppContext } from "@/hooks/useAppContext";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";
import { Heart } from "lucide-react";
import { RiHeartFill } from "react-icons/ri";

type Props = {
  button?: boolean;
  product: IMSProduct;
  className?: string;
  height?: string;
  classNameInner?: string;
  children?: ReactNode;
};

const ProductCard = ({
  product,
  className,
  classNameInner,
  height,
  button = true,
  children,
}: Props) => {
  const productId = Number(product.productId);
  const { name, variants } = product;

  const {
    cartItems,
    addToCart,
    removeFromCart,
    favCollections,
    addToCollection,
    removeFromCollection,
  } = useAppContext();

  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  /* ---------------- VARIANT SAFE IMAGE ---------------- */

  const firstVariant = variants?.[0];
  const firstImage =
    firstVariant?.images?.[0] ||
    "/Assets/Images/Newplaceholder.png";

  const defaultSize =
    firstVariant?.sizes?.[0] || "FREE";

  const defaultColor = firstVariant?.color || null;

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === defaultSize &&
      item.color === defaultColor
  );

  const handleCartToggle = () => {
    if (!defaultColor) return;

    isInCart
      ? removeFromCart(productId, defaultSize, defaultColor)
      : addToCart(productId, defaultSize, defaultColor);
  };

  useEffect(() => {
    if (!revealed) return;

    const close = () => setRevealed(false);
    document.addEventListener("touchstart", close);

    return () =>
      document.removeEventListener("touchstart", close);
  }, [revealed]);

  return (
    <div
      className={`cardBlock ${
        height ? height : "h-[78vh]"
      } overflow-hidden flex flex-col justify-between rounded-2xl my-2 ${
        className
      } w-[24%] ${revealed ? "is-open" : ""}`}
      onClick={() => {
        if (window.innerWidth < 768) {
          setRevealed((p) => !p);
        }
      }}
    >
      <Link
        target="_blank"
        href={`/product/${productId}`}
        onClick={(e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
          }
        }}
        className={`group rounded-sm flex flex-col justify-start w-full ${
          button ? "p-1.5" : ""
        } text-left`}
      >
        <div
          className={`relative ${classNameInner} imageBlock border mx-auto overflow-hidden shrink-0 w-full`}
        >
          <Image
            src={firstImage}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            alt={name}
            className="group-hover:scale-105 duration-500 transition-all"
          />
        </div>
      </Link>

      {/* COLLECTION DROPDOWN */}
      {showCollections && !selectedCollection && (
        <div className="absolute bubble top-3 flex flex-col z-50 right-8 mt-2 bg-white text-[#6a0f1f] border rounded-lg shadow-lg">
          {Object.keys(favCollections).map((collection) => (
            <div
              key={collection}
              onClick={(e) => {
                e.stopPropagation();
                addToCollection(collection, productId);
                setSelectedCollection(collection);
                setShowCollections(false);
              }}
              className="px-4 py-2 text-sm hover:bg-[#6a0f1f] hover:text-white hover:rounded-xl cursor-pointer whitespace-nowrap"
            >
              {collection}
            </div>
          ))}
        </div>
      )}

      <div
        className={`${
          !button ? "p-0" : "p-[1.5%]"
        } detailsBox transition-all duration-700`}
      >
        {children}

        {button && (
          <div className="bg-transparent h-[6vh] px-3 flex gap-1">
            <Link
              href={`/product/${productId}`}
              className="bg-[#eeddc7] px-1 rounded-lg w-full"
            >
              <div className="font-bold line-clamp-2 h-full flex justify-center items-center">
                {name}
              </div>
            </Link>

            <button
              type="button"
              onClick={handleCartToggle}
              className="bg-black cursor-pointer gap-2 px-1 text-white w-[41%] mx-auto rounded-lg hover:translate-y-1 hover:rounded-xl duration-500 transition-all flex justify-center items-center"
            >
              {isInCart ? (
                <MdOutlineRemoveShoppingCart className="text-2xl" />
              ) : (
                <FaCartArrowDown className="text-2xl" />
              )}
            </button>
          </div>
        )}
      </div>

      {button && (
        <span
          className="absolute top-1.5 right-1 cursor-pointer text-center mx-auto hover:translate-y-1 rounded-full duration-500 transition-all bg-[#EEDDC7] p-1"
          onClick={() => {
            const collectionNames =
              Object.keys(favCollections);

            if (selectedCollection) {
              removeFromCollection(
                selectedCollection,
                productId
              );
              setSelectedCollection(null);
              setShowCollections(false);
              return;
            }

            if (collectionNames.length === 1) {
              const defaultCollection =
                collectionNames[0];
              addToCollection(
                defaultCollection,
                productId
              );
              setSelectedCollection(
                defaultCollection
              );
              return;
            }

            setShowCollections((prev) => !prev);
          }}
        >
          {selectedCollection ? (
            <RiHeartFill
              size={22}
              className="text-[#ff0000]"
            />
          ) : (
            <Heart size={22} />
          )}
        </span>
      )}
    </div>
  );
};

export default ProductCard;