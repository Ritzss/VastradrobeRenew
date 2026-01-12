import Footer from "@/components/Global/Footer";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className={`font-sans`}>
      <div className="flex justify-center m-auto items-center w-[98vw]">
        {children}
      </div>
      <div>
        <Footer className="font-sans"/>
      </div>
    </section>
  );
};

export default layout;
