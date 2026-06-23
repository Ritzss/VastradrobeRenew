import FavoritesClient from "../components/products/FavoritesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

const FavoritesPage = () => {
  return <FavoritesClient />;
};

export default FavoritesPage;