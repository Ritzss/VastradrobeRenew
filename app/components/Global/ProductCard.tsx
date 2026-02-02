"use client";
import Image from "next/image";
import StarBorder from "../UI/StarBorder";
import { CiHeart } from "react-icons/ci";
import { FaCartArrowDown, FaHeart } from "react-icons/fa6";
import { IoExitOutline } from "react-icons/io5";
import { useAppContext } from "@/hooks/useAppContext";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IMSProduct } from "@/Types/Product";

type Props = {
  product: IMSProduct;
  className?: string;
};

const ProductCard = ({ product, className }: Props) => {
  const { name, description, images, price, mrp } = product;
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

  const hasImage = Array.isArray(images) && images.length > 0;

  const imageSrc = hasImage
    ? product.images[0]
    : "/Assets/Images/Newplaceholder.png";

  // ✅ derive cart state from global context
  const isInCart = cartItems.has(productId);

  const handleCartToggle = () => {
    isInCart ? removeFromCart(productId) : addToCart(productId);
  };

  const handleBuyNow = () => {
    if (!isInCart) addToCart(productId);
    router.push(`/checkout?buyNow=${productId}`);
  };
  return (
    <StarBorder
      thickness={3}
      color="#ffffff"
      speed="5s"
      className={`cardBlock flex flex-col justify-between rounded-2xl my-2 w-[24%] ${className}`}
    >
      <div
        className={`relative h-[57vh] overflow-hidden flex flex-col justify-end rounded-3xl w-full p-2.5 text-left ${!hasImage ? "bg-[#0000006b]" : ""}`}
      >
        <Image
          src={imageSrc}
          fill
          sizes="images"
          alt={name}
          className="h-55 -z-2 object-contain hover:scale-110 duration-300 transition-all mx-auto"
        ></Image>
        <span
          className="cursor-pointer self-end text-3xl"
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
            <FaHeart className="text-[#ff0000]" />
          ) : (
            <CiHeart className="text-white" />
          )}
        </span>

        {/* 📂 COLLECTION DROPDOWN */}
        {showCollections && !selectedCollection && (
          <div className="absolute right-0 bottom-20 mt-2 bg-white border rounded-lg shadow-lg z-50">
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
        <Link target="_blank" href={`/product/${productId}`}>
          <div className="flex-col hover:-translate-y-4 duration-300 text-white transition-all flex gap-5 flex-1">
            <div className="text-2xl font-bold line-clamp-1">{name}</div>
            <div>
              <p className="line-clamp-1">{description}</p>
            </div>
            <div className="font-bold text-lg ">
              &#8377;{Number(price)}
              <span className="line-through font-extralight relative bottom-3">
                &#8377;{Number(mrp)}
              </span>
            </div>
          </div>
        </Link>
        <div className="flex gap-2 justify-between">
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
      </div>
    </StarBorder>
  );
};

export default ProductCard;
