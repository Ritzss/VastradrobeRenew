"use client";
import Image from "next/image";
import StarBorder from "./components/UI/StarBorder";
import Footer from "./components/Global/Footer";
import Slider from "./components/Global/Header";
import CategoryBar from "./components/navbar/Categorybar";
import PixelCard from "./components/UI/PixelCard";

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
      <CategoryBar
        className={"bg-[#ffffff] rounded-xl text-[#cd0000] my-2"}
        drop={false}
        Img={false}
      />
      <main
        id="cards"
        className="w-full flex flex-col justify-center flex-wrap h-[30%] m-auto"
      >
        <div className="div w-full flex justify-center flex-wrap gap-3">
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="default">
              <div className="absolute  w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroWinter.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="h-[10%] text-2xl absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Winter Collections
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="blue">
              <div className="absolute w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroMen.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="h-[10%] absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Men Collections
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="pink">
              <div className="absolute w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroWomen.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="h-[10%] absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Women Collections
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="pink">
              <div className="absolute w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroChildren.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="h-[10%] absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Children Collections
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="pink">
              <div className="absolute w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroTraditionals.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="h-[10%] absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Traditonal
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
          <StarBorder
            as="button"
            color="#ffffff"
            speed="5s"
            className="cardBlock w-[24%]"
          >
            <PixelCard variant="green">
              <div className="absolute w-full h-full">
                <div className="group relative w-full h-full  ">
                  <Image
                    fill
                    src={"/Assets/Images/Hero/heroWestern.jpg"}
                    alt=""
                    className="-z-1"
                  />
                  <div className="absolute bottom-0 text-white opacity-0 transition-all duration-500 w-full group-hover:opacity-100">
                    Western Collections
                  </div>
                </div>
              </div>
            </PixelCard>
          </StarBorder>
        </div>
      </main>
      <Footer className="" />
    </section>
  );
};

export default Home;
