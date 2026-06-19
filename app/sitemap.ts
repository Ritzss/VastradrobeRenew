import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vastradrobe.com";

  const staticPages = [
    "",
    "/blog",
    "/favorites",
    "/orders",
    "/profile",
    "/search",
    "/support",
    "/policies",
    "/account",
  ];

  const categories = [
    "women",
    "men",
    "kids",
    "ethnic",
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...categoryUrls];
}