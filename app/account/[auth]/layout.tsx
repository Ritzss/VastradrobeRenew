import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className={`font-sans h-screen light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]`}>
      <div className="flex justify-center m-auto items-center w-[98vw] h-full pt-16">
        {children}
      </div>
    </section>
  );
};

export default layout;
