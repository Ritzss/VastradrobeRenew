import Slider from "./components/Global/Header";
// import CategoryBar from "./components/navbar/Categorybar";
import CategorySlider from "./components/Home/CategorySlider";
import LatestArrivals from "./components/Home/LatestProduct";
import SocialProof from "./components/Home/SocialProof";
import { IMSProduct } from "./Types/Product";

export const dynamic = "force-dynamic";

async function getLatestProducts(): Promise<IMSProduct[]> {
  try {
    const res = await fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products/latest`,
      { cache: "no-store" }
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
  return (
    <section className="w-full m-auto rounded-2xl">
      <Slider />
      {/* <CategoryBar
        className={"bg-[#ffffff] rounded-xl text-[#cd0000] my-2"}
        drop={false}
        Img={false}
      /> */}
      <CategorySlider />
      {/* ✅ Latest Products (server-side) */}
      <LatestArrivals products={latestProducts} />
      <SocialProof />
    </section>
  );
};

export default Home;
