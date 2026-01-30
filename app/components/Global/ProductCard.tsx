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

type Props = {
  Pid: number;
  title: string;
  src: string;
  description: string;
  price: number;
};

const ProductCard = ({ Pid, title, src, description, price }: Props) => {
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
    null
  );
  const router = useRouter();

  // ✅ derive cart state from global context
  const isInCart = cartItems.has(Pid);

  const handleCartToggle = () => {
    if (isInCart) {
      removeFromCart(Pid);
    } else {
      addToCart(Pid);
    }
  };

  const handleBuyNow = () => {
    if (!cartItems.has(Pid)) {
      addToCart(Pid); // adds with qty = 1
    }

    router.push(`/checkout?buyNow=${Pid}`);
  };
  return (
    <StarBorder
    thickness={3}
      color="#ffffff"
      speed="5s"
      className="cardBlock flex flex-col justify-between rounded-2xl my-2 w-[24%]"
    >
      <div className={`relative h-[57vh] overflow-hidden flex flex-col justify-end rounded-3xl w-full p-2.5 text-left ${!src ? "bg-[#0000006b]":""}`}>
        <span
          className="cursor-pointer self-end text-3xl"
          onClick={() => {
            if (selectedCollection) {
              // ❤️ already selected → remove
              removeFromCollection(selectedCollection, Pid);
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
            <CiHeart className="text-white"/>
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
                  addToCollection(collection, Pid);
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
        <Link target="_blank" href={`/product/${Pid}`}>
          <div>
            <Image
              src={src || "/Assets/Images/Newplaceholder.png"}
              fill
              alt={title}
              className="h-55 -z-2 object-contain hover:scale-110 duration-300 transition-all mx-auto"
            ></Image>
          </div>
          <div className="flex-col hover:-translate-y-4 duration-300 text-white transition-all flex gap-5 flex-1">
            <div className="text-2xl font-bold line-clamp-1">{title}</div>
            <div>
              <p className="line-clamp-1">{description}</p>
            </div>
            <div className="font-bold text-lg ">
              &#8377;{Number(price)}
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
