import Footer from "@/components/Global/Footer";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      <div className="flex justify-center border m-auto items-center w-[98vw]">
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </section>
  );
};

export default layout;
