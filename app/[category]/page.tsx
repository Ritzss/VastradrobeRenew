import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { category } = await params;
  const allowed = [
    "men",
    "women",
    "boys",
    "girls",
    "western",
    "traditionals",
    "offers",
  ];

  if (!allowed.includes(category)) {
    notFound();
  }

  const data = await fetch("https://fakestoreapi.com/products");
  const products = await data.json();

  return <ProductClient products={products} category={category} />;
};

export default Page;
