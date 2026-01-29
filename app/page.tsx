"use client";
import Image from "next/image";
import StarBorder from "./components/UI/StarBorder";
import Footer from "./components/Global/Footer";
import Slider from "./components/Global/Header";
// import CategoryBar from "./components/navbar/Categorybar";
import PixelCard from "./components/UI/PixelCard";
import Link from "next/link";
import Carousel from "./components/UI/Carousel";
import { AiFillStar } from "react-icons/ai";

const Home = () => {
  return (
    <section className="w-full m-auto rounded-2xl">
      {/* <header id="slider" className=" my-2 h-full overflow-hidden">
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
      {/* <CategoryBar
        className={"bg-[#ffffff] rounded-xl text-[#cd0000] my-2"}
        drop={false}
        Img={false}
      /> */}
      <main
        id="cards"
        className="w-full flex flex-col gap-5 overflow-x-hidden h-[30%] m-auto"
      >
        <div
          id="cardsslider"
          className="flex gap-2 py-1 shadow-[inset_0_0_30px_16px_#cd0000] slider"
        >
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/winter"}>
              <PixelCard variant="default">
                <div className="absolute  w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWinter.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Winter Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/men"}>
              <PixelCard variant="blue">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroMen.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Men Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/women"}>
              <PixelCard variant="pink">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWomen.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Women Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/children"}>
              <PixelCard variant="yellow">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroChildren.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Children Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/traditional"}>
              <PixelCard variant="pink">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroTraditionals.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Traditonal
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/western"}>
              <PixelCard variant="green">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWestern.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Western Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/winter"}>
              <PixelCard variant="default">
                <div className="absolute  w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWinter.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Winter Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/men"}>
              <PixelCard variant="blue">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroMen.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Men Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/women"}>
              <PixelCard variant="pink">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWomen.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Women Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/children"}>
              <PixelCard variant="yellow">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroChildren.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Children Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/traditional"}>
              <PixelCard variant="pink">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroTraditionals.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Traditonal
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[25%]"
          >
            <Link href={"/western"}>
              <PixelCard variant="green">
                <div className="absolute w-full h-full">
                  <div className="group relative w-full h-full  ">
                    <Image
                      fill
                      src={"/Assets/Images/Hero/heroWestern.jpg"}
                      alt=""
                      className="-z-1"
                    />
                    <div className="h-[10%] text-2xl absolute bottom-0 text-white  transition-all duration-500 w-full group-hover:opacity-100">
                      Western Collections
                    </div>
                  </div>
                </div>
              </PixelCard>
            </Link>
          </StarBorder>
        </div>
      </main>
      <aside className="p-5 flex justify-between">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-8 p-[10vh] ">
          <h2 className="text-[3rem] font-semibold text-[#2B2B2B] leading-tight">
            Trusted by Thousands.
            <br />
            Worn Every Day.
          </h2>

          {/* Hero rating */}
          <div className="flex items-center pl-10 gap-4">
            <span className="text-[3.5rem] font-bold text-[#2B2B2B]">4.8</span>

            <div>
              <div className="flex gap-1 text-yellow-400">
                <AiFillStar className="w-5 h-5" />
                <AiFillStar className="w-5 h-5" />
                <AiFillStar className="w-5 h-5" />
                <AiFillStar className="w-5 h-5" />
                <AiFillStar className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                From 2,300+ verified purchases
              </p>
            </div>
          </div>

          {/* Breakdown (supporting, not competing) */}
          <div className="flex flex-col gap-2 pl-15 text-xl text-gray-600">
            <div className="flex gap-2">
              ★★★★★ <span>78%</span>
            </div>
            <div className="flex gap-2">
              ★★★★☆ <span>15%</span>
            </div>
            <div className="flex gap-2">
              ★★★☆☆ <span>7%</span>
            </div>
          </div>

          {/* Supporting copy */}
          <p className="text-gray-600 pl-10 leading-relaxed">
            Honest feedback from customers who value comfort, quality, and fit.
            Every review you see comes from a real order.
          </p>
        </div>
        <div className="" style={{ height: "800px", position: "relative" }}>
          <Carousel
            baseWidth={500}
            autoplay
            autoplayDelay={4000}
            pauseOnHover
            loop
          />
        </div>
      </aside>
      <Footer className="" />
    </section>
  );
};

export default Home;
