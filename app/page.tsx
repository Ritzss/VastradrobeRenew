import Link from "next/link";
import Slider from "./components/Global/Header";
import ScrollReveal from "./components/Global/ScrollReveal";
import LatestArrivals from "./components/Home/LatestProduct";
import ScrollRevealProducts from "./components/Home/ScrollRevealProducts";
import SocialProof from "./components/Home/SocialProof";
import BlogPreviewGrid from "./components/Home/BlogPreviewGrid";
import LandingSlider from "./components/Home/LandingSlider";
import RecentlyViewed from "./components/Home/RecentlyViewed";
import FeaturedCollections from "./components/Home/FeaturedCollections";
import LazySection from "./components/Global/LazySection";
import ShopByColor from "./components/Home/ShopbyColor";
import WhatsAppPageMessage from "./components/Global/WhatsAppPageMessage";
import SectionHeader from "./components/Global/SectionHeader";
import { whatsappMessages } from "./lib/whatsapp";

/**
 * VastraDrobe Homepage
 *
 * The homepage is structured as an editorial shopping journey:
 *
 * Hero
 * → Promotional content
 * → Featured collections
 * → Latest arrivals
 * → Shop by color
 * → Women
 * → Kids
 * → Men
 * → Recently viewed
 * → Vastra Journal
 * → Social proof
 *
 * ScrollReveal and LazySection are intentionally retained throughout
 * the page to preserve the existing animation and performance behavior.
 */
const Home = async () => {
  let latestProducts = [];
  let womenProducts = [];
  let menProducts = [];
  let kidsProducts = [];
  let featuredCollections = [];
  let allProducts = [];

  /*
   * Fetch all homepage data from the IMS in one request.
   *
   * The 120-second revalidation keeps the homepage fast while
   * still allowing new products and collection changes to appear
   * without requiring a deployment.
   */
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
    /*
     * Keep the homepage renderable even if the IMS is temporarily
     * unavailable. Individual sections will simply receive empty
     * product arrays.
     */
    console.error("HOMEPAGE IMS FETCH FAILED:", err);
  }

  return (
    <>
      <WhatsAppPageMessage message={whatsappMessages.home()} />

      <section className="w-full bg-[#fffdf9] text-black transition-colors duration-300 dark:bg-black dark:text-white">
        {/* =====================================================
            HERO
            ===================================================== */}

        <Slider />

        {/* =====================================================
            LANDING PROMOTION
            ===================================================== */}

        <div className="block">
          <ScrollReveal direction="up" delay={100}>
            <LandingSlider />
          </ScrollReveal>
        </div>

        {/* =====================================================
            FEATURED COLLECTIONS
            ===================================================== */}

        <section className="bg-[#fffdf9] py-8 transition-colors duration-300 dark:bg-black sm:py-12">
          <LazySection placeholderHeight={450}>
            <ScrollReveal direction="up" delay={100}>
              <FeaturedCollections sections={featuredCollections} />
            </ScrollReveal>
          </LazySection>
        </section>

        {/* =====================================================
            LATEST ARRIVALS
            ===================================================== */}

        <section
          id="latestArrival"
          className=" border-y border-[#e5dfd6] bg-white py-20 text-center transition-colors duration-300 dark:border-neutral-900 dark:bg-neutral-950 sm:py-24"
        >
          <ScrollReveal direction="up" delay={100}>
            <SectionHeader
              subtitle="New This Season"
              title="Latest Arrivals"
              description="Fresh silhouettes, breathable fabrics, and elevated everyday essentials. Handcrafted with care for modern presence."
              className="mb-14 px-6"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <LatestArrivals products={latestProducts} />
          </ScrollReveal>
        </section>

        {/* =====================================================
            SHOP BY COLOR
            ===================================================== */}

        <LazySection placeholderHeight={450}>
          <ScrollReveal direction="up" delay={100}>
            <ShopByColor products={allProducts} />
          </ScrollReveal>
        </LazySection>

        {/* =====================================================
            WOMEN
            ===================================================== */}

        <section
          id="women-collection"
          className=" border-y border-[#e2dbd1] bg-[#f7f2eb] py-20 transition-colors duration-300 dark:border-neutral-900 dark:bg-neutral-950 sm:py-24"
        >
          <ScrollReveal direction="up" delay={100}>
            <SectionHeader
              subtitle="Women"
              title="Co-ords You’ll Love"
              description="Effortless silhouettes designed to move with you, from polished everyday dressing to relaxed occasions."
              className="mb-12 px-6"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <ScrollRevealProducts
              products={womenProducts}
              category="women"
              title=""
              text="#5f5143"
              color="text-[#fff5f5] dark:text-[#1a1a1a]"
              
            />
          </ScrollReveal>

          {/* <div className="mt-10 flex justify-center">
            <ScrollReveal direction="up" delay={300}>
              <Link
                href="/women"
                className=" rounded-full border border-[#bfb2a5] px-7 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#5f5143] transition-all duration-300 hover:border-[#6A0F1F] hover:bg-[#6A0F1F] hover:text-white"
              >
                Explore Women →
              </Link>
            </ScrollReveal>
          </div> */}
        </section>

        {/* =====================================================
                        KIDS
            ===================================================== */}

        <section
          id="kids-collection"
          className=" border-b border-[#dce2d5] bg-[#edf1e9] py-20 transition-colors duration-300 dark:border-neutral-900 dark:bg-[#101310] sm:py-24"
        >
          <ScrollReveal direction="up" delay={100}>
            <SectionHeader
              subtitle="Kids"
              title="Playful & Comfortable"
              description="Easy-to-wear styles made for movement, comfort, and all the little moments in between."
              className="mb-12 px-6"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <ScrollRevealProducts
              products={kidsProducts}
              category="kids"
              title=""
              color="text-[#fff8f8] dark:text-[#1a1a1a]"
            />
          </ScrollReveal>

          {/* <div className="mt-10 flex justify-center">
            <ScrollReveal direction="up" delay={300}>
              <Link
                href="/kids"
                className=" rounded-full border border-[#aeb9a6] px-7 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#53604f] transition-all duration-300 hover:border-[#53604f] hover:bg-[#53604f] hover:text-white"
              >
                Explore Kids →
              </Link>
            </ScrollReveal>
          </div> */}
        </section>

        {/* =====================================================
            MEN
            ===================================================== */}

        <section
          id="men-collection"
          className=" border-b border-[#d6cec3] bg-[#eee6db] py-20 transition-colors duration-300 dark:border-neutral-900 dark:bg-neutral-950 sm:py-24"
        >
          <ScrollReveal direction="up" delay={100}>
            <SectionHeader
              subtitle="Men"
              title="Modern Everyday Wear"
              description="Refined essentials, relaxed tailoring, and timeless silhouettes made for everyday presence."
              className="mb-12 px-6"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <ScrollRevealProducts
              products={menProducts}
              category="men"
              title=""
              text="#5f5143"
              color="text-[#fff5f5] dark:text-[#1a1a1a]"
            />
          </ScrollReveal>

          {/* <div className="mt-10 flex justify-center">
            <ScrollReveal direction="up" delay={300}>
              <Link
                href="/men"
                className=" rounded-full border border-[#b8aa9b] px-7 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#554b42] transition-all duration-300 hover:border-[#6A0F1F] hover:bg-[#6A0F1F] hover:text-white"
              >
                Explore Men →
              </Link>
            </ScrollReveal>
          </div> */}
        </section>

        {/* =====================================================
            RECENTLY VIEWED
            ===================================================== */}

        <RecentlyViewed products={allProducts} />

        {/* =====================================================
            VASTRA JOURNAL
            ===================================================== */}

        <section
          className=" bg-[#29231f] py-20 transition-colors duration-300 dark:bg-[#050505] sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            {/* =================================================
        JOURNAL HEADER
        ================================================= */}

            <ScrollReveal direction="up" delay={100}>
              <SectionHeader
                subtitle="Vastra Journal"
                title="Beyond Fabric. Into Thought."
                description="Stories on sustainability, craftsmanship, and the materials shaping modern wardrobes."
                className=" mb-14 [&_p]:text-[#b9aea4]! [&_h2]:text-[#f7f4ee]!"
              />
            </ScrollReveal>

            {/* =================================================
        BLOG ARTICLES
        ================================================= */}

            <LazySection placeholderHeight={700}>
              <ScrollReveal direction="up" delay={200}>
                <BlogPreviewGrid limit={4} />
              </ScrollReveal>
            </LazySection>

            {/* =================================================
        JOURNAL CTA
        ================================================= */}

            <div className="mt-14 flex justify-center">
              <ScrollReveal direction="up" delay={300}>
                <Link
                  href="/blog"
                  className=" rounded-full border border-[#81766d] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f7f4ee] transition-all duration-300 hover:border-[#f7f4ee] hover:bg-[#f7f4ee] hover:text-[#29231f]"
                >
                  Explore All Articles →
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            SOCIAL PROOF
            ===================================================== */}

        <section className=" bg-[#fffdf9] py-20 transition-colors duration-300 dark:bg-black sm:py-24">
          <LazySection placeholderHeight={750}>
            <ScrollReveal direction="up" delay={100}>
              <SocialProof />
            </ScrollReveal>
          </LazySection>
        </section>

        {/* =====================================================
            SEO CONTENT
            ===================================================== */}

        <section className="sr-only">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-semibold text-[#7a1020]">
              Shop Women&apos;s Co-Ord Sets Online in India
            </h2>

            <p className="mt-6 leading-8 text-[#7b6a58]">
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
