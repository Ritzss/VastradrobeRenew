"use client";
import Image from "next/image";
// import StarBorder from "../UI/StarBorder";
import { CiHeart } from "react-icons/ci";
import { FaCartArrowDown, FaHeart } from "react-icons/fa6";
import { useAppContext } from "@/hooks/useAppContext";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";

type Props = {
  button?: boolean;
  product: IMSProduct;
  className?: string;
  classNameInner?: string;
  children?: ReactNode;
};

const ProductCard = ({
  product,
  className,
  classNameInner,
  button = true,
  children,
}: Props) => {
  const { name, images, price, mrp, brand } = product;
  const productId = Number(product.productId);
  const {
    cartItems,
    addToCart,
    removeFromCart,
    favCollections,
    addToCollection,
    removeFromCollection,
  } = useAppContext();
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [revealed, setRevealed] = useState(false);

  const hasImage = Array.isArray(images) && images.length > 0;

  const imageSrc = hasImage
    ? product.images[0]
    : "/Assets/Images/Newplaceholder.png";

  // ✅ derive cart state from global context
  const defaultSize = product.sizes?.[0] || "FREE";

  const isInCart = cartItems.some(
    (item) => item.productId === productId && item.size === defaultSize,
  );

  const handleCartToggle = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isInCart
      ? removeFromCart(productId, defaultSize)
      : addToCart(productId, defaultSize);
  };
  

  useEffect(() => {
    if (!revealed) return;

    const close = () => setRevealed(false);
    document.addEventListener("touchstart", close);

    return () => document.removeEventListener("touchstart", close);
  }, [revealed]);
  return (
    <div
      className={`cardBlock border overflow-hidden flex flex-col justify-between rounded-sm my-2 ${className} w-[24%] ${revealed ? "is-open" : ""}`}
      onClick={() => {
        if (window.innerWidth < 768) {
          setRevealed((p) => !p);
        }
      }}
    >
      <Link
        target="_blank"
        href={`/product/${Number(productId)}`}
        onClick={(e) => {
          if (window.innerWidth < 768) {
            e.preventDefault();
          }
        }}
        onDoubleClick={() => {}}
        className={`group rounded-sm flex flex-col justify-start w-full ${classNameInner ? "p-2.5" : ""} p-2.5 text-left ${!hasImage ? "bg-[#0000006b]" : ""}`}
      >
        <div
        className={`relative ${classNameInner ? classNameInner : "imageBlock"} border mx-auto rounded-md overflow-hidden shrink-0 w-[95%]`}>
          <Image
          src={imageSrc}
          fill
          sizes="images"
          alt={name}
          className="group-hover:scale-105 duration-500 transition-all"
        ></Image>
        </div>
      </Link>
      {button && (
        <span
          className="cursor-pointer self-end text-3xl absolute top-2 right-2 bg-white p-1 rounded-full"
          onClick={() => {
            if (selectedCollection) {
              // ❤️ already selected → remove
              removeFromCollection(selectedCollection, productId);
              setSelectedCollection(null);
              setShowCollections(false);
            } else {
              // 🤍 not selected → open dropdown
              setShowCollections((prev) => !prev);
            }
          }}
        >
          {selectedCollection ? (
            <FaHeart size={18} className="text-[#ff0000]" />
          ) : (
            <CiHeart size={18} className="text-black" />
          )}
        </span>
      )}

      {/* 📂 COLLECTION DROPDOWN */}
      {showCollections && !selectedCollection && (
        <div className="absolute right-0 top-10 mt-2 bg-white text-black border rounded-lg shadow-lg z-50">
          {Object.keys(favCollections).map((collection) => (
            <div
              key={collection}
              onClick={(e) => {
                e.stopPropagation(); // 🚫 prevent heart click
                addToCollection(collection, productId);
                setSelectedCollection(collection);
                setShowCollections(false);
              }}
              className="px-4 py-2 text-sm hover:bg-gray-100 hover:rounded-xl cursor-pointer whitespace-nowrap"
            >
              {collection}
            </div>
          ))}
        </div>
      )}
      <div className="detailsBox transition-all duration-700">
        {button && (<Link target="_blank" href={`/product/${Number(productId)}`} className="">
          <div className="flex-col duration-300 bg-transparent transition-all flex gap-2 flex-1">
            <div className="text-lg font-semibold line-clamp-1 ">
              {brand}
            </div>
            <div className="text-2xl font-bold line-clamp-1 ">
              {name}
            </div>
            {/* <div>
              <p className="line-clamp-1 hover:text-[#cd0000]">{description}</p>
            </div> */}
            <div className="text-xl">
               &#8377;{Number(price)}
            </div>
            <div className="text-sm">
               M.R.P:
              <span className="line-through font-extralight text-[#7b7777]">
               &#8377;{Number(mrp)}
              </span>
              <span className="bg-[#00ff00] relative left-3 bottom-2 p-[0.35rem] rounded-md text-lg">{Math.floor((price * 100) / mrp)}% OFF</span>
            </div>
          </div>
        </Link>)}
        {children}
        {button && (
          <div className="bg-transparent">
            <button
              type="button"
              onClick={handleCartToggle}
              className="bg-black gap-2 p-1 text-white w-[80%] mx-auto rounded-lg hover:translate-y-1 hover:rounded-xl duration-500 transition-all flex justify-center items-center"
            >
              {isInCart ? (
                <>
                  Remove Item
                  <MdOutlineRemoveShoppingCart className="text-2xl " />
                </>
              ) : (
                <>
                  Add to Cart
                  <FaCartArrowDown className="text-2xl" />
                </>
              )}
            </button>

            
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
