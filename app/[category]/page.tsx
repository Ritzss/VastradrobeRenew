/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { toast } from "sonner";

type PageProps = {
  params: Promise<{ category: string }>;
};

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
};

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase().replace(/\/$/, "");

  if (!CATEGORY_MAP[normalizedCategory]) {
    notFound();
  }

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?page=1&limit=20`,
    { next: { revalidate: 120 } }
  );


  // await new Promise(res => setTimeout(res, 2000));

  if (!res.ok) {
    return toast.error("Fetch Failed");;
  }

  const data = await res.json();
  const categoryFilters = CATEGORY_MAP[normalizedCategory];

  const products = data.products.filter((p: any) =>
    categoryFilters.includes(p.category)
  );

  return (
    <ProductClient
      products={products}
    />
  );
}
