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

/**
 * 👑 LUXURY REDESIGN: VastraDrobe Homepage (Nangalia Ruchira Theme)
 *
 * Optimized & Cleaned Production Code:
 * - Standardized every single section header across the homepage with elegant uppercase tracked typography.
 * - Removed redundant multi-colored sliding announcements.
 * - 🔒 FIXED: Removed the slow "Vastra in Motion" video block to drastically speed up page loads and performance.
 * - 🧹 CODE CLEANUP: Removed all legacy commented-out, dead, and redundant blocks to make the file pristine and production-ready.
 */
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
      <section className="w-full bg-[#fcfbfa] dark:bg-black text-black dark:text-white transition-colors duration-300">
        {/* HERO CAROUSEL */}
        <Slider />

        {/* LANDING PAGE PROMO SLIDER */}
        <div className="hidden md:block">
          <LandingSlider />
        </div>

        {/* FEATURED COLLECTIONS (Grid Desktop / Swipeable Mobile) */}
        <LazySection placeholderHeight={450}>
          <FeaturedCollections sections={featuredCollections} />
        </LazySection>

        {/* LATEST ARRIVALS */}
        <section
          id="latestArrival"
          className="mx-auto py-16 text-center bg-[#faf9f6] dark:bg-neutral-950 border-t border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300"
        >
          <div className="max-w-4xl mx-auto px-6 mb-12">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              New This Season
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-2">
              Latest Arrivals
            </h2>

            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto mt-4 text-xs leading-relaxed font-light font-sans tracking-wide">
              Fresh silhouettes, breathable fabrics, and elevated everyday
              essentials. Handcrafted with care for modern presence.
            </p>
          </div>

          <LatestArrivals products={latestProducts} />
        </section>

        {/* SHOP BY COLOR */}
        <LazySection placeholderHeight={450}>
          <ShopByColor products={allProducts} />
        </LazySection>

        {/* WOMEN COLLECTION */}
        <section
          id="collection"
          className="bg-[#faf9f6] dark:bg-neutral-950 py-16 border-t border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 text-center mb-10">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Women
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-2">
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

        {/* KIDS COLLECTION */}
        <section className="bg-[#fcfbfa] dark:bg-black py-16 border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center mb-10">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Kids
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-2">
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

        {/* MEN COLLECTION */}
        <section className="bg-[#faf9f6] dark:bg-neutral-950 py-16 border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center mb-10">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Men
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase mt-2">
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

        {/* RECENTLY VIEWED */}
        <LazySection placeholderHeight={550}>
          <RecentlyViewed products={allProducts} />
        </LazySection>

        {/* BLOG VASTRA JOURNAL */}
        <section className="bg-[#fcfbfa] dark:bg-black py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16 space-y-3">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  Vastra Journal
                </p>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
                  Beyond Fabric. Into Thought.
                </h2>

                <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-xs leading-relaxed font-light">
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
                className="px-10 py-3.5 rounded-full border border-neutral-300 hover:border-neutral-800 dark:border-neutral-800 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
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
