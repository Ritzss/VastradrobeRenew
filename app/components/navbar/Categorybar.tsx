"use client";
import Boysbox from "./HoverBoxes/Boysbox";
import GirlsBox from "./HoverBoxes/GirlsBox";
import Menbox from "./HoverBoxes/Menbox";
import Traditionalbox from "./HoverBoxes/Traditionalbox";
import Westernbox from "./HoverBoxes/WesternBox";
import Womenbox from "./HoverBoxes/Womenbox";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";

const CategoryBar = (props: { className: unknown; drop: boolean; Img:boolean }) => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <section
      className={`flex overflow-hidden justify-evenly border text-xl rounded-b-xl w-full ${props.className}`}
    >
      <NavItem
        href="/men"
        src="/Assets/Images/CateImg/mennew.png"
        label="Men"
        active={isActive("/men")}
        hover="hover:bg-[#00ffff] hover:shadow-[inset_0_0_10px_0_#00ffff]"
        activeStyle="bg-[#00ffff] shadow-[inset_0_0_10px_0_#00ffff]"
        dropdown={<Menbox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/women"
        src="/Assets/Images/CateImg/womennew.png"
        label="Women"
        active={isActive("/women")}
        hover="hover:bg-[#f04aff] hover:shadow-[inset_0_0_10px_0_#f04aff]"
        activeStyle="bg-[#f04aff] shadow-[inset_0_0_10px_0_#f04aff]"
        dropdown={<Womenbox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/boys"
        src="/Assets/Images/CateImg/boy.png"
        label="Boys"
        active={isActive("/boys")}
        hover="hover:bg-[#ffff00] hover:shadow-[inset_0_0_10px_0_#ffff00]"
        activeStyle="bg-[#ffff00] shadow-[inset_0_0_10px_0_#ffff00]"
        dropdown={<Boysbox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/girls"
        src="/Assets/Images/CateImg/girl.png"
        label="Girls"
        active={isActive("/girls")}
        hover="hover:bg-[#ff00d4] hover:shadow-[inset_0_0_10px_0_#ff00d4]"
        activeStyle="bg-[#ff00d4] shadow-[inset_0_0_10px_0_#ff00d4]"
        dropdown={<GirlsBox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/western"
        src="/Assets/Images/CateImg/western.png"
        label="Western"
        active={isActive("/western")}
        hover="hover:bg-[#a6ff00] hover:shadow-[inset_0_0_10px_0_#a6ff00]"
        activeStyle="bg-[#a6ff00] shadow-[inset_0_0_10px_0_#a6ff00]"
        dropdown={<Westernbox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/traditionals"
        src="/Assets/Images/CateImg/traditional.png"
        label="Traditional"
        active={isActive("/traditionals")}
        hover="hover:bg-[#c50052] hover:shadow-[inset_0_0_10px_0_#c50052]"
        activeStyle="bg-[#c50052] shadow-[inset_0_0_10px_0_#c50052]"
        dropdown={<Traditionalbox />}
        drop={props.drop}
        Img={props.Img}
      />

      <NavItem
        href="/offers"
        src="/Assets/Images/CateImg/offer.png"
        label="Offer"
        active={isActive("/offers")}
        hover="hover:bg-[#ff6600] hover:shadow-[inset_0_0_10px_0_#ff6600]"
        activeStyle="bg-[#ff6600] shadow-[inset_0_0_10px_0_#ff6600]"
        Img={props.Img}
      />
    </section>
  );
};

export default CategoryBar;
