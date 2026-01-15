import React from "react";
import GlareHover from "../UI/GlareHover";

const SkeletonLoader = () => {
  return (
    <GlareHover
      glareColor="#ffffff"
      glareOpacity={0.15}
      glareAngle={-30}
      glareSize={150}
      width="25%"
      height="60svh"
      transitionDuration={800}
      playOnce={false}
      background="#f9fafb"
      borderColor="#00000000"
    >
      <div className="bg-[#c2c2c2b7] w-[80%] rounded-xl h-55 mt-5 object-contain duration-300 transition-all mx-auto "></div>
      <div className="flex-col w-[90%] duration-300 transition-all m-3  flex items-center gap-5 ">
        <div className="bg-[#c2c2c2b7] w-full h-8 rounded-xl"></div>
        <div className="bg-[#c2c2c2b7] w-full h-8 rounded-xl"></div>
        <div className="bg-[#c2c2c2b7] w-full h-8 rounded-xl"></div>
      </div>
      <div className="rounded-xl w-[90%] mb-5 flex gap-1 h-9 m-3 justify-between">
        <div className="bg-[#c2c2c2b7] w-[60%] rounded-lg duration-500 transition-all "></div>
        <div className="bg-[#c2c2c2b7] w-[40%] rounded-lg duration-500 transition-all "></div>
      </div>
    </GlareHover>
  );
};

export default SkeletonLoader;
