import Link from "next/link";
// import BlogClient from "./blog/BlogsClient";
import Slider from "./components/Global/Header";
import ScrollReveal from "./components/Global/ScrollReveal";
// import CategoryBar from "./components/navbar/Categorybar";
// import CategorySlider from "./components/Home/CategorySlider";
// import HomeVideos from "./components/Home/HomeVideos";
import LatestArrivals from "./components/Home/LatestProduct";
import ScrollRevealProducts from "./components/Home/ScrollRevealProducts";
// import SocialProof from "./components/Home/SocialProof";
// import { IMSProduct } from "./Types/Product";
// import HomeVideosWrapper from "./components/Global/HomeVideosWrapper";
// import BlogClientWrapper from "./components/Global/BlogClientWrapper";
import SocialProofClient from "./components/Global/SocialProofClient";
import dynamic from "next/dynamic";
import BlogPreviewGrid from "./components/Home/BlogPreviewGrid";
import LandingSlider from "./components/Home/LandingSlider";
import RecentlyViewed from "./components/Home/RecentlyViewed";
import FeaturedCollections from "./components/Home/FeaturedCollections";
import ShopByColor from "./components/Home/ShopbyColor";
import LazySection from "./components/Global/LazySection";

// const BlogClient = dynamic(() => import("./blog/BlogsClient"));
const HomeVideos = dynamic(() => import("./components/Home/HomeVideos"), {
  loading: () => <div className="h-125 w-full bg-gray-200 animate-pulse" />,
});
// const SocialProof = dynamic(() => import("./components/Home/SocialProof"),
//   { ssr: false }
// );
// const SocialSection = dynamic(() => import("./components/Home/SocialSection"));

// const CATEGORY_MAP: Record<string, string[]> = {
//   men: ["men"],
//   women: ["women"],
//   kids: ["boys", "girls"],
//   ethnic: ["ethnic"],
// };

// export const dynamic = "force-dynamic";
// async function getProductsByMainCategory(
//   mainCategory: string,
//   limit = 8,
// ): Promise<IMSProduct[]> {
//   try {
//     const categories = CATEGORY_MAP[mainCategory.toLowerCase()] || [];

//     if (categories.length === 0) return [];

//     const responses = await Promise.all(
//       categories.map((cat) =>
//         fetch(
//           `${process.env.IMS_BASE_URL}/api/ims/public/products?category=${cat}&limit=${limit}`,
//           { next: { revalidate: 120 } },
//         ),
//       ),
//     );

//     const results = await Promise.all(
//       responses.map((res) =>
//         res.ok ? res.json() : Promise.resolve({ products: [] }),
//       ),
//     );

//     return results.flatMap((r) => r.products || []);
//   } catch (err) {
//     console.error(`${mainCategory.toUpperCase()} FETCH ERROR:`, err);
//     return [];
//   }
// }

// async function getLatestProducts(): Promise<IMSProduct[]> {
//   try {
//     const res = await fetch(
//       `${process.env.IMS_BASE_URL}/api/ims/public/products/latest`,
//       { next: { revalidate: 60 } },
//     );

//     if (!res.ok) return [];

//     const data = await res.json();
//     return data.products || [];
//   } catch (err) {
//     console.error("LATEST PRODUCTS FETCH ERROR:", err);
//     return [];
//   }
// }

const Home = async () => {
  const res = await fetch(`${process.env.IMS_BASE_URL}/api/ims/public/home`, {
    next: {
      revalidate: 120,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch homepage");
  }

  const {
    latestProducts,
    womenProducts,
    menProducts,
    kidsProducts,
    featuredCollections,
    allProducts,
  } = await res.json();

  // const data = await featuredRes.json();

  return (
    <section className="w-full bg-[#f9f5ef] text-black ">
      {/* HERO */}
      <Slider />

      {/* LANDING PAGE PROMO */}
      <div className="hidden md:block">
        <LandingSlider />
      </div>

      {/* CATEGORY */}
      {/* <section id="category-section" className="py-20 bg-[#dfc9ac] text-center">
        <p className="uppercase tracking-[0.35em]  text-sm text-[#25272D] mb-4">
          Explore
        </p>
        <h2 className="text-4xl text-[#6a0f1f] font-semibold mb-12">
          Shop by Category
        </h2>
        <CategorySlider />
      </section> */}

      {/* Featured Collection */}
      <FeaturedCollections sections={featuredCollections} />

      {/* LATEST ARRIVALS */}
      <section
        id="latestArrival"
        className="mx-auto py-5 text-center bg-[#fffaf6]"
      >
        <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
          New This Season
        </p>

        <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold mb-6">
          Latest Arrivals
        </h2>

        <p className="text-[#957f6a] max-w-xl mx-auto mb-8 text-base leading-relaxed">
          Fresh silhouettes, breathable fabrics, and elevated everyday
          essentials.
        </p>

        <LatestArrivals products={latestProducts} />
      </section>

      {/* Shop by Color */}
      {/* <LazySection placeholderHeight={900}>
        <ShopByColor products={allProducts} />
      </LazySection> */}

      {/* WOMEN */}
      <section id="collection" className="bg-[#F6F5F3] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center mb-5">
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
            Women
          </p>

          <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold">
            Co-ords You’ll Love
          </h2>
        </div>
        <ScrollRevealProducts
          products={womenProducts}
          category="women"
          title=""
          text="black"
          color="#fffaf6"
        />
      </section>

      {/* Kids */}
      <section className="bg-[#fffaf6] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center mb-5">
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
            Kids
          </p>

          <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold">
            Playful & Comfortable
          </h2>
        </div>

        <ScrollRevealProducts
          products={kidsProducts}
          category="kids"
          title=""
          color="#f9f5ef"
        />
      </section>

      {/* MEN */}
      <section className="bg-[#F6F5F3] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center mb-5">
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
            Men
          </p>

          <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold">
            Modern Everyday Wear
          </h2>
        </div>

        <ScrollRevealProducts
          products={menProducts}
          category="men"
          title=""
          text="black"
          color="#fffaf6"
        />
      </section>

      {/* Recently Viewed */}
      <LazySection placeholderHeight={550}>
        <RecentlyViewed products={allProducts} />
      </LazySection>

      {/* VIDEO SECTION */}
      <section className="bg-[#fffaf6] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
            Craftsmanship
          </p>

          <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold">
            See Vastra in Motion
          </h2>
        </div>

        <LazySection placeholderHeight={700}>
          <HomeVideos />
        </LazySection>
      </section>

      {/* BLOG */}
      <section className="bg-[#F6F5F3] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="uppercase tracking-[0.35em] text-[12px] text-[#957f6a] mb-4">
                Vastra Journal
              </p>

              <h2 className="text-4xl md:text-5xl text-[#5f5143] font-semibold mb-6">
                Beyond Fabric. Into Thought.
              </h2>

              <p className="text-[#7a6a5c] max-w-2xl mx-auto text-lg">
                Stories on sustainability, craftsmanship, and the materials
                shaping modern wardrobes.
              </p>
            </div>
          </ScrollReveal>

          <LazySection placeholderHeight={700}>
            <BlogPreviewGrid limit={3} />
          </LazySection>

          <div className="flex justify-center mt-16">
            <Link
              href="/blog"
              className="px-10 py-3 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#5f5143] hover:text-white transition"
            >
              Explore All Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* Social Media */}
      {/* <SocialSection /> */}

      {/* SOCIAL PROOF */}
      <LazySection placeholderHeight={450}>
        <SocialProofClient />
      </LazySection>
    </section>
  );
};

export default Home;
