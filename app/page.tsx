import Link from "next/link";
import Slider from "./components/Global/Header";
import ScrollReveal from "./components/Global/ScrollReveal";
import LatestArrivals from "./components/Home/LatestProduct";
import ScrollRevealProducts from "./components/Home/ScrollRevealProducts";
import SocialProofClient from "./components/Global/SocialProofClient";
import dynamic from "next/dynamic";
import BlogPreviewGrid from "./components/Home/BlogPreviewGrid";
import LandingSlider from "./components/Home/LandingSlider";
import RecentlyViewed from "./components/Home/RecentlyViewed";
import FeaturedCollections from "./components/Home/FeaturedCollections";
import LazySection from "./components/Global/LazySection";
import ShopByColor from "./components/Home/ShopbyColor";
import WhatsAppPageMessage from "./components/Global/WhatsAppPageMessage";
import { whatsappMessages } from "./lib/whatsapp";

const HomeVideos = dynamic(() => import("./components/Home/HomeVideos"), {
  loading: () => <div className="h-125 w-full bg-gray-200 animate-pulse" />,
});

const Home = async () => {
  let latestProducts = [];
  let womenProducts = [];
  let menProducts = [];
  let kidsProducts = [];
  let featuredCollections = [];
  let allProducts = [];

  try {
    const res = await fetch(`${process.env.IMS_BASE_URL}/api/ims/public/home`, {
      next: {
        revalidate: 120,
      },
    });

    if (res.ok) {
      const data = await res.json();
      latestProducts = data.latestProducts || [];
      womenProducts = data.womenProducts || [];
      menProducts = data.menProducts || [];
      kidsProducts = data.kidsProducts || [];
      featuredCollections = data.featuredCollections || [];
      allProducts = data.allProducts || [];
    } else {
      console.warn("Homepage fetch returned non-200 status:", res.status);
    }
  } catch (err) {
    console.error(
      "HOMEPAGE IMS FETCH FAILED (Graceful fallback to empty state):",
      err,
    );
  }

  return (
    <>
      <WhatsAppPageMessage message={whatsappMessages.home()} />
      <section className="w-full dark:bg-black bg-[#fff8f8] text-black ">
        {/* HERO */}
        <Slider />

        {/* LANDING PAGE PROMO */}
        <div className="hidden md:block">
          <LandingSlider />
        </div>

        {/* Featured Collection */}
        <LazySection placeholderHeight={450}>
          <FeaturedCollections sections={featuredCollections} />
        </LazySection>

        {/* LATEST ARRIVALS */}
        <section
          id="latestArrival"
          className="mx-auto py-5 text-center dark:bg-black bg-[#fff5f5]"
        >
          <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
            New This Season
          </p>

          <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold mb-6">
            Latest Arrivals
          </h2>

          <p className="text-[#a94d5d] max-w-xl mx-auto mb-8 text-base leading-relaxed">
            Fresh silhouettes, breathable fabrics, and elevated everyday
            essentials.
          </p>

          <LatestArrivals products={latestProducts} />
        </section>

        {/* Shop by Color */}
        <LazySection placeholderHeight={450}>
          <ShopByColor products={allProducts} />
        </LazySection>

        {/* WOMEN */}
        <section id="collection" className=" dark:bg-black bg-[#fff0f0] py-8">
          <div className="max-w-7xl mx-auto px-6 text-center mb-5">
            <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
              Women
            </p>

            <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold">
              Co-ords You’ll Love
            </h2>
          </div>
          <ScrollRevealProducts
            products={womenProducts}
            category="women"
            title=""
            text="#5f5143"
            color="text-[#fff5f5] dark:text-[#1a1a1a]"
          />
        </section>

        {/* Kids */}
        <section className=" dark:bg-black bg-[#fff5f5] py-8">
          <div className="max-w-7xl mx-auto px-6 text-center mb-5">
            <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
              Kids
            </p>

            <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold">
              Playful & Comfortable
            </h2>
          </div>

          <ScrollRevealProducts
            products={kidsProducts}
            category="kids"
            title=""
            color="text-[#fff8f8] dark:text-[#1a1a1a]"
          />
        </section>

        {/* MEN */}
        <section className=" dark:bg-black bg-[#fff0f0] py-8">
          <div className="max-w-7xl mx-auto px-6 text-center mb-5">
            <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
              Men
            </p>

            <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold">
              Modern Everyday Wear
            </h2>
          </div>

          <ScrollRevealProducts
            products={menProducts}
            category="men"
            title=""
            text="#5f5143"
            color="text-[#fff5f5] dark:text-[#1a1a1a]"
          />
        </section>

        {/* Recently Viewed */}
        <LazySection placeholderHeight={550}>
          <RecentlyViewed products={allProducts} />
        </LazySection>

        {/* VIDEO SECTION */}
        <section className=" dark:bg-black bg-[#fff5f5] py-8">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
              Craftsmanship
            </p>

            <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold">
              See Vastra in Motion
            </h2>
          </div>

          <LazySection placeholderHeight={700}>
            <HomeVideos />
          </LazySection>
        </section>

        {/* BLOG */}
        <section className=" dark:bg-black bg-[#fff0f0] py-8">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-20">
                <p className="uppercase tracking-[0.35em] text-[12px] text-[#a94d5d] mb-4">
                  Vastra Journal
                </p>

                <h2 className="text-4xl md:text-5xl text-[#7a1020] font-semibold mb-6">
                  Beyond Fabric. Into Thought.
                </h2>

                <p className="text-[#6f3d46] max-w-2xl mx-auto text-lg">
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
                className="px-10 py-3 rounded-full border border-[#7a1020] text-[#7a1020] hover:bg-[#7a1020] hover:text-white transition"
              >
                Explore All Articles →
              </Link>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <LazySection placeholderHeight={450}>
          <SocialProofClient />
        </LazySection>

        {/* SEO Content Section */}
        <section className="sr-only">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#7a1020]">
              Shop Women&apos;s Co-Ord Sets Online in India
            </h2>

            <p className="mt-6 text-[#7b6a58] leading-8">
              Discover premium women&apos;s co-ord sets online in India,
              including formal co-ord sets for women, office wear co-ord sets,
              cotton co-ord sets, western wear, ethnic wear, dresses, tops, and
              everyday fashion. VastraDrobe offers thoughtfully designed
              clothing crafted for comfort, elegance, and modern lifestyles.
            </p>
          </div>
        </section>
      </section>
    </>
  );
};

export default Home;
