"use client";
import Image from "next/image";
import StarBorder from "./components/UI/StarBorder";
import Footer from "./components/Global/Footer";
import { IoIosArrowForward } from "react-icons/io";
import Slider from "./components/Global/Header";
import CategoryBar from "./components/navbar/Categorybar";

const Home = () => {


  return (
    <section className="w-full m-auto rounded-2xl">
      {/* <header id="slider" className=" my-2 h-[60vh] overflow-hidden">
        <div className={`flex slide h-full`}>
          <div className="relative  min-w-full h-full">
            <Image
              src={"/Assets/Images/slider2.png"}
              fill
              className=" object-cover"
              alt=""
            />
          </div>
          <div className="relative min-w-full h-full">
            <Image
              src={"/Assets/Images/slider3.png"}
              fill
              className=" object-cover"
              alt=""
            />
          </div>
          <div className="relative min-w-full h-full">
            <Image
              src={"/Assets/Images/slider4.png"}
              fill
              className=" object-cover"
              alt=""
            />
          </div>
        </div>
      </header> */}
      <Slider />
      <CategoryBar className={"bg-[#ffffff] rounded-xl text-[#cd0000] my-2"} drop={false} Img={true}  />
      <main
        id="cards"
        className="w-full flex flex-col justify-center flex-wrap h-[30%] m-auto"
      >
        <div className="div w-full flex justify-center flex-wrap gap-3">
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[38%] "
          >
            <div className="text-left flex justify-between text-2xl font-bold">
              Winter Collections
              <div className=" w-[5%] text-xl m-1 rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard3.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Sweat-Shirts
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min 60-70% Off
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard3.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Caps & Gloves
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Flat 30% Off on Trending
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard3.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Jackets
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  🌟 New Arrivals 🌟
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/vastra7.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Sweater&apos;s
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Fresh Drops
                </div>
              </div>
            </div>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[38%]"
          >
            <div className="text-left flex justify-between text-2xl font-bold">
              Men Collections
              <div className=" w-[5%] text-xl m-1 rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Pants
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min 40-50% Off
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Party
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  50% Discount on Top Brands
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Formals
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Top Deals
                </div>
              </div>
              <div className="w-[43%] m-2 ">
                <Image
                  src={"/Assets/Images/CardPics/jcard2.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Shirts
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min. 70% Off
                </div>
              </div>
            </div>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[20%] "
          >
            <div className="text-left flex justify-between text-2xl font-bold">
              Traditonal
              <div className="w-[10%] m-1 text-xl rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-col flex-wrap">
              <div className="w-full">
                <Image
                  src={"/Assets/Images/CardPics/lcard1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Ethic Wear
                </div>
                <div className=" font-bold text-green-600 m-2 text-xl text-left">
                  Flat 30% Off on Top Brands
                </div>
              </div>
              <div className="w-full">
                <Image
                  src={"/Assets/Images/CardPics/vastra1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Festive Wear
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Best Deals
                </div>
              </div>
            </div>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[20%] "
          >
            <div className="text-left flex justify-between text-2xl font-bold">
              Offers
              <div className="w-[10%] m-1 text-xl rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-col flex-wrap">
              <div className="w-full">
                <Image
                  src={"/Assets/Images/top_offer/offer11.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Flat 50% Off
                  <div className="text-red-500 font-medium">
                    Limited Period Offer
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Image
                  src={"/Assets/Images/top_offer/offer33.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Kids Sweat-Shirts
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min 40% Off
                </div>
              </div>
            </div>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[38%] "
          >
            <div className="text-left flex justify-between text-2xl font-bold">
              Women Collections
              <div className=" w-[5%] text-xl m-1 rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/CardPics/lcard1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Jeans
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min. 70-80% Off
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/top_offer/offer11.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Western
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Latest Arrivals
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/top_offer/offer11.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Suits
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Special Offers
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/CardPics/vastra1.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Saree
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Trending
                </div>
              </div>
            </div>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className=" cardBlock w-[38%] "
          >
            <div className="text-left  flex justify-between text-2xl font-bold">
              Children Collections
              <div className=" w-[5%] text-xl m-1 rounded-full flex justify-center items-center bg-[#0084ff] text-white">
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/CardPics/lcard2.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Dresses
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Top Deals
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/top_offer/offer33.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Shirts
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Fresh Arrivals
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/top_offer/offer33.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-99999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Casuals
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Top Deals
                </div>
              </div>
              <div className="w-[43%] m-2">
                <Image
                  src={"/Assets/Images/CardPics/vastra6.png"}
                  width={300}
                  height={400}
                  alt="img"
                  className="hover:scale-105 hover:z-9999 ease-in-out transition-all duration-400"
                ></Image>
                <div className="m-2 font-semibold text-[20px] text-left">
                  Tops
                </div>
                <div className="m-2 font-bold text-green-600 text-xl text-left">
                  Min. 60% Off
                </div>
              </div>
            </div>
          </StarBorder>
        </div>
      </main>
      <Footer className="" />
    </section>
  );
};

export default Home;
