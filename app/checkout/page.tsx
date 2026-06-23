import { Metadata } from "next";
import CheckoutClient from "../components/checkout/CheckoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const CheckoutPage = async () => {

  return <CheckoutClient />;
};

export default CheckoutPage;
