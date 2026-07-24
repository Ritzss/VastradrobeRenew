import { notFound } from "next/navigation";
import type { Metadata } from "next";

import ProductCard from "@/components/Global/ProductCard";
import { COLLECTIONS } from "@/lib/collections";
import { IMSProduct } from "@/Types/Product";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const collection = COLLECTIONS.find(
    (c) => c.slug === slug,
  );

  if (!collection) {
    return {};
  }

  return {
    title: `${collection.title} | VastraDrobe`,
    description: collection.description,

    alternates: {
      canonical: `https://vastradrobe.com/collections/${collection.slug}`,
    },

    openGraph: {
      title: `${collection.title} | VastraDrobe`,
      description: collection.description,
      url: `https://vastradrobe.com/collections/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({
  params,
}: Props) {
  const { slug } = await params;

  const collection = COLLECTIONS.find(
    (c) => c.slug === slug,
  );

  if (!collection) {
    notFound();
  }

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?page=1&limit=200`,
    {
      next: {
        revalidate: 120,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  const products: IMSProduct[] = data.products || [];

  const filteredProducts = products.filter((product) =>
    collection.subcategories.includes(product.subcategory ?? ""),
  );

  return (
    <section className="dark:bg-neutral-950 not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] min-h-screen pt-5">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
            Collection
          </p>

          <h1 className="mt-4 text-5xl font-semibold text-[#5f5143]">
            {collection.title}
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-[#7a6a5c] leading-7">
            {collection.description}
          </p>

          <p className="mt-6 text-sm text-[#957f6a]">
            {filteredProducts.length} Products
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              Linked
            />
          ))}

        </div>

      </div>

    </section>
  );
}