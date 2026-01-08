import Footer from "@/components/Global/Footer";
import { greatVibes } from "@/font";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className={`${greatVibes.className}`}>
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
