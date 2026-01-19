import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const allowed = [
  "men",
  "women",
  "boys",
  "girls",
  "western",
  "traditionals",
  "offers",
];

export default async function Page({ params }: PageProps) {
  // 🔥 IMPORTANT: await params
  const { category } = await params;

  if (!allowed.includes(category)) {
    notFound();
  }

  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const products = await res.json();

  return <ProductClient products={products} category={category} />;
}
