export type BusinessType =
  | "Boutique"
  | "Retailer"
  | "Reseller"
  | "Corporate"
  | "Event"
  | "Other";

export interface VolumeTier {
  minQty: number;
  maxQty: number | null; // null = "and above"
  price: number;
}

export interface TradeProduct {
  slug: string;
  sku: string;
  name: string;
  fabric: string;
  image: string;
  mrp: number;
  tradePrice: number;
  moq: number;
  availableUnits: number;
  sizes: string[];
  colors: string[];
  volumeTiers: VolumeTier[];
  collection: string;
}

export interface TradeCollection {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface TradeOrder {
  id: string;
  date: string;
  amount: number;
  status: "Delivered" | "Processing" | "Shipped" | "Awaiting Payment";
  items: { productSlug: string; name: string; quantity: number }[];
}

export interface TradeBuyer {
  businessName: string;
  outstandingOrders: number;
  pendingOrders: number;
  totalSpend: number;
  availableCredit: number | null;
}
