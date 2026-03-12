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

export type ProductVariant = {
  color: string;
  sizes: string[];
  images: string[];
};

export type IMSProduct = {
  productId: number;
  name: string;
  description?: string;
  price: number;
  mrp?: number;
  category: string;
  subcategory?: string;
  stock?: number;
  brand?: string;

  variants: ProductVariant[];

  sizeChartType?:
    | "kidsHoodie"
    | "fullSleeveTop"
    | "ribbedTop"
    | "generalTopBottom";

  productDetails?: ProductDetails;
};