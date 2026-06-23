/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from "next";
import { createSlug } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vastradrobe.com";

  const staticPages = [
    "",
    "/collection",
    "/blog",
    "/support",
    "/policies",
    "/women",
    "/men",
    "/kids",
    "/ethnic",
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? ("daily" as const) : ("weekly" as const),
    priority: page === "" ? 1.0 : 0.9,
  }));

  let productUrls: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products?limit=5000`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (res.ok) {
      const data = await res.json();

      productUrls = (data.products || []).map((product: any) => {
        const category =
          ["boys", "girls"].includes(product.category?.toLowerCase())
            ? "kids"
            : product.category?.toLowerCase();

        return {
          url: `${baseUrl}/${category}/${createSlug(
            product.name,
            product.productId,
          )}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        };
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return [...staticUrls, ...productUrls];
}