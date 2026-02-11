import SideFilter from "@/components/Global/SideFilter";
import CategoryBar from "@/components/navbar/Categorybar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="">
      <article className="group">
        <CategoryBar className={" text-[#cd0000]"} drop={false} Img={false} />
      
      </article>
      <div className="flex justify-between">
        <div className="hidden md:block w-64">
        <SideFilter />
      </div>
      <div className="flex-wrap flex justify-center w-full">{children}</div>
      </div>
    </section>
  );
};

export default layout;
