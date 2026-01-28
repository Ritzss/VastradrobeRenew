import ProductCard from "@/components/Global/ProductCard";
import { Key } from "react";

const ProductClient = async () => {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  const Products = Array.isArray(data.products) ? data.products : [];

  return (
    <section className="w-full px-4 ">
      <div className="mb-4 text-sm text-gray-600">
        Showing {Products.length} products
      </div>

      <div
        className="flex flex-wrap justify-evenly text-black"
      >
        {Products.map(
          (item: {
            productId: Key;
            name: string;
            images: unknown[];
            description: unknown;
            price: number;
          }) => (
            <ProductCard
              key={item.productId}
              Pid={item.productId as number}
              title={item.name}
              src={
                (item.images?.[0] as string) ||
                "/Assets/Images/placeholder.png"
              }
              description={(item.description as string) || ""}
              price={item.price}
            />
          )
        )}
      </div>
    </section>
  );
};

export default ProductClient;
