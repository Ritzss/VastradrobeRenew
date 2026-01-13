"use client";

import StarBorder from "@/components/UI/StarBorder";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const { cartItems, products, removeFromCart, incrementQty, decrementQty } =
    useAppContext();

  const cartProducts = products.filter((p) => cartItems.has(p.id));

  const cartTotal = cartProducts.reduce((sum, item) => {
    const qty = cartItems.get(item.id)!;
    return sum + Math.round(item.price * 100) * qty;
  }, 0);

  if (cartProducts.length === 0) {
    return (
      <div className="p-10 text-xl flex flex-col justify-center items-center gap-4">
        <div >Your cart is empty</div>
        
        <button >
          Return to <Link href={"/"} className="p-2 rounded bg-[#cd0000] text-white hover:shadow-[inset_0_0_10px_#000000]">Home</Link>
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {cartProducts.map((item) => {
        const qty = cartItems.get(item.id)!;
        const price = Math.round(item.price * 100);

        return (
          <StarBorder
            key={item.id}
            color="#ffffff"
            speed="5s"
            className="cardBlock flex justify-between rounded-2xl my-2"
          >
            <div className="flex justify-between w-full">
              {/* IMAGE */}
              <Image
                src={item.image}
                width={150}
                height={150}
                alt={item.title}
                className="object-contain"
              />

              {/* DETAILS */}
              <div className="flex flex-col justify-center text-left flex-1 px-6 gap-3">
                <div className="text-2xl font-bold line-clamp-1">
                  {item.title}
                </div>
                <p className="line-clamp-2">{item.description}</p>
                <div className="font-bold text-lg">
                  ₹{(price * qty)}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 w-50">
                {/* QTY CONTROL */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrementQty(item.id)}
                    className="w-10 bg-gray-200 hover:bg-gray-300"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center">
                    {qty}
                  </div>
                  <button
                    onClick={() => incrementQty(item.id)}
                    className="w-10 bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  className="bg-red-600 text-white rounded-lg py-2"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </StarBorder>
        );
      })}

      {/* CART SUMMARY */}
      <div className="flex justify-between items-center border-t pt-6">
        <div className="text-2xl font-bold">
          Total: ₹{cartTotal}
        </div>

        <Link href="/checkout">
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
