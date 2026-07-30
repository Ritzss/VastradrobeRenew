import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { COLLECTIONS } from "@/lib/collections";
import { IMSProduct } from "@/Types/Product";
import CollectionClient from "@/components/collections/CollectionClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const collection = COLLECTIONS.find((c) => c.slug === slug);

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

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const collection = COLLECTIONS.find((c) => c.slug === slug);

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
    <CollectionClient collection={collection} products={filteredProducts} />
  );
}
