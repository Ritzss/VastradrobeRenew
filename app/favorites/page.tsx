import FavoritesClient from "./FavoritesClient";
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