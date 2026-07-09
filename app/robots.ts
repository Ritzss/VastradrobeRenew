import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/cart",
        "/account",
        "/profile",
        "/favorites",
        "/orders",
        "/login",
        "/register",
      ],
    },
    sitemap: "https://vastradrobe.com/sitemap.xml",
  };
}