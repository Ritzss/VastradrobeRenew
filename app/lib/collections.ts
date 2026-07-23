export type Collection = {
  slug: string;
  title: string;
  label: string;
  description: string;
  subcategories: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "summer-collection",
    title: "Summer Collection",
    label: "☀️ Summer Collection",
    description:
      "Lightweight fabrics and breathable silhouettes designed for warm days and effortless fashion.",
    subcategories: [
      "Women Summer Cord Set",
      "women denim cordset",
      "Western Tops",
      "Crop Tops",
    ],
  },

  {
    slug: "winter-collection",
    title: "Winter Collection",
    label: "❄️ Winter Collection",
    description:
      "Stay warm in premium jackets, hoodies, winter co-ords and outerwear crafted for comfort and style.",
    subcategories: [
      "Winter Cordset",
      "Hoodie",
      "Jacket",
      "Overcoat",
    ],
  },

  {
    slug: "co-ord-collection",
    title: "Co-Ord Collection",
    label: "👗 Co-Ord Collection",
    description:
      "Matching co-ord sets that combine comfort with contemporary everyday style.",
    subcategories: [
      "Co-ord Sets",
      "lounge co-ord set",
    ],
  },

  {
    slug: "ethnic-collection",
    title: "Ethnic Collection",
    label: "🎉 Ethnic Collection",
    description:
      "Celebrate every occasion with elegant ethnic wear inspired by timeless traditions.",
    subcategories: [
      "Kurta Sets",
      "Trousers",
    ],
  },

  {
    slug: "office-wear",
    title: "Office Wear",
    label: "👔 Office Wear",
    description:
      "Professional styles designed to keep you looking sharp throughout your workday.",
    subcategories: [
      "Casual Shirts",
    ],
  },

  {
    slug: "kids-collection",
    title: "Kids Collection",
    label: "🧒 Kids Collection",
    description:
      "Comfortable and playful outfits designed for growing kids.",
    subcategories: [
      "girls",
      "Girls plazzo Co-ordset",
    ],
  },
];