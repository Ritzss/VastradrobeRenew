import { TradeBuyer, TradeCollection, TradeOrder, TradeProduct } from "./types";

// NOTE: everything in this file is placeholder data standing in for the
// shared product/inventory/order backend described in the brief. Replace
// each export with a real fetch against your existing product + IMS layer
// once this is wired into the main app — the page components don't care
// where the data comes from, only that the shapes in types.ts are met.

export const tradeCollections: TradeCollection[] = [
  {
    slug: "new-season",
    name: "New Season",
    description: "The first drops of the year, fresh off the line.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
    productCount: 42,
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "Proven movers that keep reordering.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    productCount: 28,
  },
  {
    slug: "boutique-essentials",
    name: "Boutique Essentials",
    description: "Foundational pieces every rack needs.",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
    productCount: 35,
  },
  {
    slug: "premium-collection",
    name: "Premium Collection",
    description: "Elevated fabrics and finishes for a higher price point.",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80",
    productCount: 19,
  },
  {
    slug: "festive-edit",
    name: "Festive Edit",
    description: "Statement pieces for the season's most important occasions.",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80",
    productCount: 24,
  },
  {
    slug: "ready-to-ship",
    name: "Ready to Ship",
    description: "In stock now, no waiting on production runs.",
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=1200&q=80",
    productCount: 51,
  },
];

export const tradeProducts: TradeProduct[] = [
  {
    slug: "silk-heritage-kurta",
    sku: "VD-KUR-1042",
    name: "Silk Heritage Kurta",
    fabric: "Pure mulberry silk, hand-finished hem",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80",
    mrp: 2499,
    tradePrice: 1299,
    moq: 12,
    availableUnits: 184,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Ivory", "Rust", "Forest"],
    collection: "festive-edit",
    volumeTiers: [
      { minQty: 12, maxQty: 49, price: 1299 },
      { minQty: 50, maxQty: 99, price: 1199 },
      { minQty: 100, maxQty: null, price: 1099 },
    ],
  },
  {
    slug: "linen-relaxed-shirt",
    sku: "VD-SHT-0781",
    name: "Linen Relaxed Shirt",
    fabric: "European linen, garment-washed",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80",
    mrp: 1899,
    tradePrice: 999,
    moq: 12,
    availableUnits: 96,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Off-White", "Charcoal", "Olive"],
    collection: "boutique-essentials",
    volumeTiers: [
      { minQty: 12, maxQty: 49, price: 999 },
      { minQty: 50, maxQty: 99, price: 899 },
      { minQty: 100, maxQty: null, price: 799 },
    ],
  },
  {
    slug: "cotton-coord-set",
    sku: "VD-CRD-0339",
    name: "Cotton Co-ord Set",
    fabric: "Brushed cotton twill",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    mrp: 2199,
    tradePrice: 1149,
    moq: 12,
    availableUnits: 210,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Sand", "Slate", "Blush"],
    collection: "new-season",
    volumeTiers: [
      { minQty: 12, maxQty: 49, price: 1149 },
      { minQty: 50, maxQty: 99, price: 1049 },
      { minQty: 100, maxQty: null, price: 949 },
    ],
  },
];

export const buyerProfile: TradeBuyer = {
  businessName: "Anaya Boutique",
  outstandingOrders: 2,
  pendingOrders: 1,
  totalSpend: 486200,
  availableCredit: 150000,
};

export const buyerOrders: TradeOrder[] = [
  {
    id: "TRD-10432",
    date: "2026-08-18",
    amount: 62400,
    status: "Shipped",
    items: [
      { productSlug: "silk-heritage-kurta", name: "Silk Heritage Kurta", quantity: 24 },
      { productSlug: "cotton-coord-set", name: "Cotton Co-ord Set", quantity: 12 },
    ],
  },
  {
    id: "TRD-10398",
    date: "2026-08-02",
    amount: 38900,
    status: "Delivered",
    items: [
      { productSlug: "linen-relaxed-shirt", name: "Linen Relaxed Shirt", quantity: 36 },
    ],
  },
  {
    id: "TRD-10355",
    date: "2026-07-11",
    amount: 91200,
    status: "Delivered",
    items: [
      { productSlug: "silk-heritage-kurta", name: "Silk Heritage Kurta", quantity: 50 },
      { productSlug: "linen-relaxed-shirt", name: "Linen Relaxed Shirt", quantity: 24 },
    ],
  },
];

export function getProductBySlug(slug: string): TradeProduct | undefined {
  return tradeProducts.find((p) => p.slug === slug);
}

export function priceForQuantity(product: TradeProduct, quantity: number): number {
  const tier =
    [...product.volumeTiers]
      .sort((a, b) => b.minQty - a.minQty)
      .find((t) => quantity >= t.minQty) ?? product.volumeTiers[0];
  return tier.price;
}
