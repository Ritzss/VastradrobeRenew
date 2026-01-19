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


const normalizedCategory = category
  .toLowerCase()
  .replace(/\/$/, "");




  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });

  const products = await res.json();

  return <ProductClient products={products} category={normalizedCategory}/>;
}
