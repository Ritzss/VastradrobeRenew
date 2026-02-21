"use client";
import Image from "next/image";
// import StarBorder from "../UI/StarBorder";
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
      className={`cardBlock ${height ? height : "h-[78vh]"} overflow-hidden flex flex-col justify-between rounded-2xl my-2 ${className} w-[24%] ${revealed ? "is-open" : ""}`}
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
        className={`group rounded-sm flex flex-col justify-start w-full ${button ? "p-2.5" : ""} text-left ${!hasImage ? "bg-[#0000006b]" : ""}`}
      >
        <div
          className={`relative ${classNameInner} imageBlock border mx-auto overflow-hidden shrink-0 w-[95%]`}
        >
          <Image
            src={imageSrc}
            fill
            sizes="images"
            alt={name}
            priority
            className="group-hover:scale-105 duration-500 transition-all"
          ></Image>
        </div>
      </Link>

      {/* 📂 COLLECTION DROPDOWN */}
      {showCollections && !selectedCollection && (
        <div className="absolute bottom-16 flex left-1 mt-2 bg-white text-[#6a0f1f] border rounded-lg shadow-lg z-50">
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
      <div
        className={`${!button ? "p-0" : "p-[1.5%]"} detailsBox transition-all duration-700`}
      >
        {button && (
          <Link
            target="_blank"
            href={`/product/${Number(productId)}`}
            className=""
          >
            <div className="flex-col duration-300 bg-transparent transition-all flex gap-2 flex-1">
              
              {/* <div>
              <p className="line-clamp-1 hover:text-[#cd0000]">{description}</p>
            </div> */}
              {/* <div className="text-xl">&#8377;{Number(price)}</div>
              <div className="text-sm">
                M.R.P:
                <span className="line-through font-extralight text-[#7b7777]">
                  &#8377;{Number(mrp)}
                </span>
                {mrp && mrp > price && (
                  <span className="text-[#008000] relative left-0 bottom-3 p-[0.35rem] rounded-md text-lg">
                    {Math.floor(((mrp - price) / mrp) * 100)}% OFF
                  </span>
                )}
              </div> */}
            </div>
          </Link>
        )}
        {children}
        {button && (
          <div className="bg-transparent flex gap-1 px-1">
            <div className="bg-[#eeddc7] p-1 rounded-lg w-full">
              <div className="font-semibold line-clamp-1 ">{brand}</div>
            <div className="font-bold line-clamp-1 ">{name}</div>
            </div>
            <button
              type="button"
              onClick={handleCartToggle}
              className="bg-black cursor-pointer gap-2 p-1 text-white w-[21%] mx-auto rounded-lg hover:translate-y-1 hover:rounded-xl duration-500 transition-all flex justify-center items-center"
            >
              {isInCart ? (
                <>
                  
                  <MdOutlineRemoveShoppingCart className="text-2xl " />
                </>
              ) : (
                <>
                  
                  <FaCartArrowDown className="text-2xl" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
            <span
              className="absolute top-1.5 right-1 cursor-pointer text-center mx-auto hover:translate-y-1 rounded-full duration-500 transition-all bg-[#EEDDC7] p-1"
              onClick={() => {
                const collectionNames = Object.keys(favCollections);

                if (selectedCollection) {
                  removeFromCollection(selectedCollection, productId);
                  setSelectedCollection(null);
                  setShowCollections(false);
                  return;
                }

                // 🔥 If only one collection → auto add
                if (collectionNames.length === 1) {
                  const defaultCollection = collectionNames[0];
                  addToCollection(defaultCollection, productId);
                  setSelectedCollection(defaultCollection);
                  return;
                }

                // 👇 If multiple collections → show dropdown
                setShowCollections((prev) => !prev);
              }}
            >
              {selectedCollection
                ? <RiHeartFill size={22} className="text-[#ff0000]"/>
                : <Heart size={22} />}
            </span>
    </div>
  );
};

export default ProductCard;
