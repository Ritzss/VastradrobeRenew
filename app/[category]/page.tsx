import ProductCard from "@/components/Global/ProductCard";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

type Product = {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string;
};

const page = async ({ params }: PageProps) => {
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

  const data = await fetch("https://fakestoreapi.com/products");
  const products = await data.json();

  const filterdProducts = products.filter((p: unknown) =>
    (p as Product).category.includes(category)
  );

  if (!allowed.includes(category)) {
    notFound();
  }

  return (
    <div className="flex flex-wrap justify-evenly text-black">
      {filterdProducts.map((item: Product) => (
        <ProductCard
        key={item.id.toString()}
          category={category}
          title={item.title}
          src={item.image}
          description={item.description}
          price={BigInt(Math.round(item.price))}
        />
      ))}
    </div>
  );
};

export default page;
