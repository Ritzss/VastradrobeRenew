import OrdersPageClient from "../components/products/OrderPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

const OrdersPage = () => {
return (
  <OrdersPageClient />
)
};

export default OrdersPage;
