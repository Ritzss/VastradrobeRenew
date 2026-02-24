// Types/IMSProduct.ts

export type ProductDetails = {
  material?: string;
  closureType?: string;
  careInstructions?: string;
  style?: string;
  pattern?: string;
  countryOfOrigin?: string;
  manufacturer?: string;
  manufacturerContact?: string;
  packer?: string;
  packerContact?: string;
  unitCount?: string;
};

export type IMSProduct = {
  productId: number;
  name: string;
  description?: string;
  images: string[];
  price: number;
  mrp?: number;
  category: string;
  subcategory?: string;
  sizes: string[];
  color: string[];
  stock?: number;
  brand?: string;

  // 🔥 NEW STRUCTURED FIELDS
  sizeChartType?: 
    | "kidsHoodie"
    | "fullSleeveTop"
    | "ribbedTop"
    | "generalTopBottom";

  productDetails?: ProductDetails;
};