// Types/IMSProduct.ts
export type IMSProduct = {
  [x: string]: number;
  productId: number;
  name: string;
  description?: string;
  images: string[];
  price: number;
  mrp?: number;
  category: string;
  subcategory?: string;
  sizes?: string[];
  stock?: number;
};
