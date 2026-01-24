import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import CartClient from "./CartClient";

const CartPage = async () => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/account/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    redirect("/account/login");
  }

  return <CartClient />;
};

export default CartPage;
