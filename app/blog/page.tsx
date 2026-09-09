import type { Metadata } from "next";
import BlogClient from "../components/blog/BlogsClient";

export const metadata: Metadata = {
  title: "Fashion Blog | Style Tips, Trends & Guides | VastraDrobe",

  description:
    "Explore VastraDrobe's fashion blog for clothing guides, styling tips, color advice, outfit inspiration, fashion trends, and practical wardrobe ideas for modern shoppers.",

  keywords: [
    "fashion blog",
    "fashion tips",
    "clothing tips",
    "style tips",
    "outfit ideas",
    "fashion trends",
    "clothing color guide",
    "skin tone clothing colors",
    "wardrobe guide",
    "VastraDrobe",
  ],

  authors: [
    {
      name: "VastraDrobe",
    },
  ],

  creator: "VastraDrobe",
  publisher: "VastraDrobe",

  alternates: {
    canonical: "https://vastradrobe.com/blog",
  },

  openGraph: {
    title: "VastraDrobe Fashion Blog | Style, Trends & Guides",
    description:
      "Discover fashion guides, styling tips, outfit inspiration, clothing color advice, and the latest fashion ideas from VastraDrobe.",
    url: "https://vastradrobe.com/blog",
    siteName: "VastraDrobe",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "VastraDrobe Fashion Blog | Style, Trends & Guides",
    description:
      "Fashion guides, styling tips, outfit inspiration, clothing color advice, and wardrobe ideas from VastraDrobe.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const BlogsPage = () => {
  return <BlogClient />;
};

export default BlogsPage;