"use client";
import Image from "next/image";
// import StarBorder from "../UI/StarBorder";
import { CiHeart } from "react-icons/ci";
import { FaCartArrowDown, FaHeart } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { useAppContext } from "@/hooks/useAppContext";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const { name, images, price, mrp } = product;
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
  const router = useRouter();
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
  const handleBuyNow = () => {
    if (!isInCart) {
      addToCart(productId, defaultSize);
    }

    router.push(`/checkout?buyNow=${Number(productId)}&size=${defaultSize}`);
  };

  useEffect(() => {
    if (!revealed) return;

    const close = () => setRevealed(false);
    document.addEventListener("touchstart", close);

    return () => document.removeEventListener("touchstart", close);
  }, [revealed]);
  return (
    <div
      className={`cardBlock overflow-hidden flex flex-col justify-between rounded-2xl my-2 ${className} w-[24%] ${revealed ? "is-open" : ""}`}
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
        className={`relative ${classNameInner ? classNameInner : "h-[57vh]"} imageBlock group overflow-hidden shrink-0 flex flex-col justify-end rounded-b-2xl group-hover:rounded-b-sm w-full p-2.5 text-left ${!hasImage ? "bg-[#0000006b]" : ""}`}
      >
        <Image
          src={imageSrc}
          fill
          sizes="images"
          alt={name}
          className="group-hover:scale-105 duration-500 transition-all"
        ></Image>
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
        <Link target="_blank" href={`/product/${Number(productId)}`} className="">
          <div className="flex-col duration-300 text-white bg-transparent transition-all flex gap-6 flex-1">
            <div className="text-2xl font-bold line-clamp-1 ">
              {name}
            </div>
            {/* <div>
              <p className="line-clamp-1 hover:text-[#cd0000]">{description}</p>
            </div> */}
            <div className="font-bold text-end text-lg">
              &#8377;{Number(price)}
              <span className="line-through font-extralight relative bottom-3">
                &#8377;{Number(mrp)}
              </span>
            </div>
          </div>
        </Link>
        {children}
        {button && (
          <div className="flex gap-2 bg-transparent justify-between">
            <button
              type="button"
              onClick={handleCartToggle}
              className="bg-black gap-2 text-white w-[75%] rounded-lg hover:translate-y-1 hover:rounded-xl duration-500 transition-all flex justify-center items-center"
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

            <button
              onClick={handleBuyNow}
              className="p-2 rounded-lg hover:translate-y-1 hover:rounded-xl w-[50%] bg-[#cd0000] duration-500 transition-all text-white flex justify-center items-center gap-2 "
            >
              Buy Now <IoExitOutline className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
