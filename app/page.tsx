import Link from "next/link";
// import BlogClient from "./blog/BlogsClient";
import Slider from "./components/Global/Header";
import ScrollReveal from "./components/Global/ScrollReveal";
// import CategoryBar from "./components/navbar/Categorybar";
import CategorySlider from "./components/Home/CategorySlider";

// import HomeVideos from "./components/Home/HomeVideos";
import LatestArrivals from "./components/Home/LatestProduct";
import ScrollRevealProducts from "./components/Home/ScrollRevealProducts";
// import SocialProof from "./components/Home/SocialProof";
import { IMSProduct } from "./Types/Product";
import dynamic from "next/dynamic";

const BlogClient = dynamic(() => import("./blog/BlogsClient"));
const HomeVideos = dynamic(() => import("./components/Home/HomeVideos"));
const SocialProof = dynamic(() => import("./components/Home/SocialProof"));

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
  ethnic: ["ethnic"],
};

// export const dynamic = "force-dynamic";

async function getProductsByMainCategory(
  mainCategory: string,
  limit = 8
): Promise<IMSProduct[]> {
  try {
    const categories = CATEGORY_MAP[mainCategory.toLowerCase()] || [];

    if (categories.length === 0) return [];

    const responses = await Promise.all(
      categories.map((cat) =>
        fetch(
          `${process.env.IMS_BASE_URL}/api/ims/public/products?category=${cat}&limit=${limit}`,
          { next: { revalidate: 120 } }
        )
      )
    );

    const results = await Promise.all(
      responses.map((res) =>
        res.ok ? res.json() : Promise.resolve({ products: [] })
      )
    );

    return results.flatMap((r) => r.products || []);
  } catch (err) {
    console.error(`${mainCategory.toUpperCase()} FETCH ERROR:`, err);
    return [];
  }
}


async function getLatestProducts(): Promise<IMSProduct[]> {
  try {
    const res = await fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products/latest`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error("LATEST PRODUCTS FETCH ERROR:", err);
    return [];
  }
}

const Home = async () => {
  const latestProducts = await getLatestProducts();

const womenProducts = await getProductsByMainCategory("women");
const kidsProducts = await getProductsByMainCategory("kids");
const menProducts = await getProductsByMainCategory("men");
const ethnicProducts = await getProductsByMainCategory("ethnic");

  return (
    <section className="w-full bg-[#EEDDC7] text-black">
      {/* HERO */}
      <Slider />

      {/* CATEGORY */}
      <section id="category-section" className="py-20 bg-[#dfc9ac] text-center">
        <p className="uppercase tracking-[0.35em]  text-sm text-gray-500 mb-4">
          Explore
        </p>
        <h2 className="text-4xl text-[#6a0f1f] font-semibold mb-12">
          Shop by Category
        </h2>
        <CategorySlider />
      </section>

      {/* LATEST ARRIVALS */}
      <ScrollReveal>
        <section className="max-w-7xl mx-auto px-6 py-28 text-center">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            New This Season
          </p>
          <h2 className="text-5xl  text-[#6a0f1f] font-semibold mb-6">
            Latest Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
            Fresh silhouettes, breathable fabrics, and elevated everyday
            essentials.
          </p>

          <LatestArrivals products={latestProducts} />
        </section>
      </ScrollReveal>

      {/* WOMEN */}
      <section className="bg-[#dfc9ac] py-28">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Women
          </p>
          <h2 className="text-4xl text-[#6a0f1f] font-semibold">
            Co-ords You&apos;ll Love
          </h2>
        </div>

        <ScrollRevealProducts
          products={womenProducts}
          category="women"
          title=""
          color="#dfc9ac"
        />
      </section>

      {/* Kids */}
      <section className=" . py-28">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Kids
          </p>
          <h2 className="text-4xl text-[#6a0f1f] font-semibold">
            Playful & Comfortable
          </h2>
        </div>

        <ScrollRevealProducts
          products={kidsProducts}
          category="kids"
          title=""
          color="#eeddc7"
        />
      </section>

      {/* MEN */}
      <section className=". bg-[#dfc9ac] py-28">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Men
          </p>
          <h2 className="text-4xl text-[#6a0f1f] font-semibold">
            Modern Everyday Wear
          </h2>
        </div>

        <ScrollRevealProducts
          products={menProducts}
          category="men"
          title=""
          color="#dfc9ac"
        />
      </section>

      {/* ETHNIC */}
      <section className=". py-28">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Ethnic
          </p>
          <h2 className="text-4xl text-[#6a0f1f] font-semibold">
            Timeless Ethnic Wear
          </h2>
        </div>

        <ScrollRevealProducts
          products={ethnicProducts}
          category="ethnic"
          title=""
          color="#eeddc7"
        />
      </section>

      {/* VIDEO SECTION */}
      <ScrollReveal>
        <section className="py-28 bg-[#dfc9ac] text-center">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Craftsmanship
          </p>
          <h2 className="text-4xl  text-[#6a0f1f] font-semibold mb-12">
            See Vastra in Motion
          </h2>

          <HomeVideos />
        </section>
      </ScrollReveal>

      {/* BLOG */}
      <ScrollReveal>
        <section className=" mx-auto md:px-6 py-32 text-center">
          <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
            Vastra Journal
          </p>

          <h2 className="text-5xl  text-[#6a0f1f] font-semibold mb-6">
            Beyond Fabric. Into Thought.
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-20">
            Stories on sustainability, craftsmanship, and the materials shaping
            modern wardrobes.
          </p>

          <BlogClient limit={3} showTitle={false} />

          <div className="mt-20">
            <Link
              href="/blog"
              className="inline-block border border-black px-10 py-4 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300 text-lg"
            >
              Explore All Articles →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* SOCIAL PROOF */}
      <section className="bg-[#dfc9ac] py-28">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
              Community
            </p>
            <h2 className="text-4xl  text-[#6a0f1f] font-semibold mb-12">
              Loved by Thousands
            </h2>
            <SocialProof />
          </div>
        </ScrollReveal>
      </section>
    </section>
  );
};

export default Home;
