"use client";

import { usePathname } from "next/navigation";
import NavItem from "./NavItem";

const CategoryBar = (props: {
  className?: string;
  drop: boolean;
  Img: boolean;
}) => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <section
      className={`w-full border-b
        ${props.className ?? ""}
      `}
    >
      {/* MOBILE: horizontal scroll */}
      <div
        className=" flex md:hidden gap-2 px-2 overflow-x-auto no-scrollbar text-sm"
      >
        <CategoryItems isActive={isActive} Img={props.Img} />
      </div>

      {/* DESKTOP: evenly spaced */}
      <div
        className=" hidden md:flex justify-evenly text-base lg:text-lg"
      >
        <CategoryItems isActive={isActive} Img={props.Img} />
      </div>
    </section>
  );
};

const CategoryItems = ({
  isActive,
  Img,
}: {
  isActive: (path: string) => boolean;
  Img: boolean;
}) => (
  <>
    <NavItem
      href="/men"
      src="/Assets/Images/CateImg/mennew.png"
      Img={Img}
      label="Men"
      active={isActive("/men")}
      hover="hover:bg-[#00ffff] hover:border-[#00ffff] hover:border-b-2"
      activeStyle="bg-[#00ffff] border-[#00ffff] border-b-2"
    />

    <NavItem
      href="/women"
      src="/Assets/Images/CateImg/womennew.png"
      Img={Img}
      label="Women"
      active={isActive("/women")}
      hover="hover:bg-[#f04aff] hover:border-[#f04aff] hover:border-b-2"
      activeStyle="bg-[#f04aff] border-[#f04aff] border-b-2"
    />

    <NavItem
      href="/kids"
      src=""
      Img={Img}
      label="Kids"
      active={isActive("/kids")}
      hover="hover:bg-[#ffff00] hover:border-[#ffff00] hover:border-b-2"
      activeStyle="bg-[#ffff00] border-[#ffff00] border-b-2"
    />

    
  </>
);

export default CategoryBar;
