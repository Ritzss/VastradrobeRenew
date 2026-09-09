import CartClient from "../components/cart/CartClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const CartPage = async () => {
  // Allow guests to view their cart page (cart loads from localStorage for guest visitors)
  return <CartClient />;
};

export default CartPage;
