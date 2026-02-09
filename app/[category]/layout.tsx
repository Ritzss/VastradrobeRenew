import SideFilter from "@/components/Global/SideFilter";
import CategoryBar from "@/components/navbar/Categorybar";
// import ParentSubCategoryBar from "@/components/navbar/ParentSubCategoryBar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="">
      <article className="group">
        <CategoryBar className={" text-[#cd0000]"} drop={false} Img={false} />
        {/* <ParentSubCategoryBar
          className="translate-y-0 opacity-100 md:-translate-y-6 md:opacity-0 md:duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
        /> */}
      </article>
      {/* Sidebar */}
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
