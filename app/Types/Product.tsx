// Types/IMSProduct.ts
export type IMSProduct = {
  productId: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  mrp: number;
  category: string;
  subcategory: string;
  sizes: string[];
  color:string[];
  stock?: number;
  brand?:string;
  material?: string
  fit?: string
  care?: string
};
