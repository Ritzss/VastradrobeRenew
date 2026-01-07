"use client";
import Image from "next/image";
import React, { ReactNode, useState } from "react";
import StarBorder from "../UI/StarBorder";
import { CiHeart } from "react-icons/ci";
import { FaCartArrowDown, FaHeart } from "react-icons/fa6";
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoExitOutline } from "react-icons/io5";

const ProductCard = (props: {
  category: ReactNode;
  key: string;
  title: string;
  src: string;
  description: string;
  price: bigint;
}) => {
  const { category, key, title, src, description, price } = props;

  const a = category;
  console.log(a);

  const [like, setLike] = useState<boolean>(true);
  const [cart, setCart] = useState<boolean>(false);

  const handleAddtoCart = () => {
    setCart(!cart);
  };

  return (
    <StarBorder
      key={key}
      color="#00f7ff"
      speed="5s"
      className=" flex flex-col justify-between rounded-2xl my-2 w-[24%]"
    >
      <div className="flex flex-col justify-between text-left h-full">
        <div className="self-end text-3xl" onClick={() => setLike(!like)}>
          {like ? <CiHeart /> : <FaHeart />}
        </div>
        <div>
          <Image
            src={src}
            width={150}
            height={2}
            alt="image"
            className="h-55 object-contain hover:scale-110 duration-300 transition-all mx-auto"
          ></Image>
        </div>
        <div className="flex-col hover:-translate-y-4  bg-white duration-300 transition-all flex gap-5 flex-1">
          <div className="text-2xl font-bold line-clamp-1">{title}</div>
          <div>
            <p className="line-clamp-2">{description}</p>
          </div>
          <div className="font-bold text-lg ">&#8377;{Number(price) * 100}</div>
        </div>
        <div className="flex  gap-2 justify-between">
          <button
            onClick={handleAddtoCart}
            className="p-1 w-[70%] bg-black text-white rounded-lg flex justify-center items-center gap-2 transition-all duration-300 hover:translate-y-1 hover:rounded-xl"
          >
            {cart ? "Remove from Cart" : "Add to Cart"}
            <span className="relative w-7 h-7 text-center overflow-hidden">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300
                ${
                  cart
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-5 opacity-0"
                }`}
              >
                <BsFillCartCheckFill className="text-2xl text-[#00ff00]" />
              </span>

              <span
                className={`absolute inset-0 text-center flex items-center justify-center transition-all duration-300
                ${
                  cart ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                <FaCartArrowDown className="text-2xl text-[#ffffff]" />
              </span>
            </span>
          </button>
          <button className="p-2 rounded-lg hover:translate-y-1 hover:rounded-xl w-[50%] bg-[#078569] text-white flex justify-center items-center gap-2 ">
            Buy Now <IoExitOutline className="text-2xl" />
          </button>
        </div>
      </div>
    </StarBorder>
  );
};

export default ProductCard;
