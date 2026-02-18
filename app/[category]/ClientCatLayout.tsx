"use client";

import SideFilter from "@/components/Global/SideFilter";
import CategoryBar from "@/components/navbar/Categorybar";
import { ReactNode, useState } from "react";

const ClientCatLayout = ({ children }: { children: ReactNode }) => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <section className="">
      <article className="group">
        <CategoryBar className={" text-[#cd0000]"} drop={false} Img={false} />
      </article>
      <div className="md:hidden flex justify-between">
        <button
          onClick={() => setShowFilter(true)}
          className="md:hidden fixed bottom-6 right-6 bg-[#6a0f1f] text-white px-5 py-3 rounded-full shadow-lg z-30"
        >
          Filters
        </button>
        <div className="md:block w-64">
          {showFilter && <SideFilter onClose={() => setShowFilter(false)} />}
        </div>
        <div className="flex-wrap flex justify-center w-full">{children}</div>
      </div>
      <div className="hidden md:flex justify-between">
        <div className="hidden md:block w-64">
          <SideFilter />
        </div>
        <div className="flex-wrap flex justify-center w-full">{children}</div>
      </div>
    </section>
  );
};

export default ClientCatLayout;
