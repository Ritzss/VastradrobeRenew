'use client'
import { useAppContext } from "@/hooks/useAppContext";
import { useRouter } from "next/navigation";

const Menbox = () => {
  const summerWear =
    "ml-8 text-lg hover:scale-105 hover:font-semibold hover:text-shadow-[0_0_10px_rgb(255,255,255)] duration-300 transition-all leading-loose";

  const winterWear =
    "ml-4 text-lg hover:scale-105 hover:font-semibold hover:text-shadow-[0_0_10px_rgb(255,255,255)] duration-300 transition-all leading-loose";

  const summerItems = [
    "Cotton Shirts",
    "Linen Pants",
    "T-Shirts",
    "Shorts",
    "Trousers",
    "Summer Kurtas",
  ];

  const winterItems = [
    "Shirts",
    "Pants",
    "Jackets",
    "Sweater",
    "Hoodies & Sweatshirts",
  ];

  const ethnicItems = [
    "Kurtas",
    "Kurta Pajamas",
    "Pathani Suits",
    "Dhoti Kurta",
    "Sherwanis",
    "Nehru Jackets",
    "Festive Wear",
  ];

  const { setSubCategory } = useAppContext();
  const router = useRouter();;

  const handleClick = (item: string) => {
    const value = item.toLowerCase().replace(/\s+/g, "-");
    setSubCategory(value);
    router.push(`/men?type=${value}`);
  };

  return (
    <section className="w-[98vw] ml-2 py-5 text-white bg-[#000000e3] rounded-2xl shadow-[0_0_7px_rgb(255,255,255)]">
      <div className="w-full p-2 text-4xl">Men&apos;s Collection</div>
      <div className="flex justify-around p-4">
        <span className="w-[33.3%]">
          <div className="text-left text-3xl font-bold hover:scale-105 duration-300 transition-all ml-4">
            Summer Wear&apos;s
          </div>
          {summerItems.map((item) => {
            return (
              <div
                key={item}
                className={summerWear}
                onClick={() => handleClick(item)}
              >
                {item}
              </div>
            );
          })}
        </span>
        <span className="w-[33.3%]">
          <div className="text-left text-3xl font-bold hover:scale-105 duration-300 transition-all">
            Winter Wear&apos;s
          </div>
          {winterItems.map((item) => {
            return (
              <div
                key={item}
                className={winterWear}
                onClick={() => handleClick(item)}
              >
                {item}
              </div>
            );
          })}
        </span>
        <span className="w-[33.3%]">
          <div className="text-left text-3xl font-bold hover:scale-105 duration-300 transition-all">
            Ethnics Wear&apos;s
          </div>
          {ethnicItems.map((item) => {
            return (
              <div
                key={item}
                className={winterWear}
                onClick={() => handleClick(item)}
              >
                {item}
              </div>
            );
          })}
        </span>
      </div>
    </section>
  );
};

export default Menbox;
