import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className={`font-sans h-screen bg-[#f9f5ef]`}>
      <div className="flex justify-center m-auto items-center w-[98vw] h-full pt-16">
        {children}
      </div>
    </section>
  );
};

export default layout;
