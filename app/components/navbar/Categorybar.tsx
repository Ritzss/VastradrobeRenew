"use client";
import Menbox from "./HoverBoxes/Menbox";
import Traditionalbox from "./HoverBoxes/Traditionalbox";
import Westernbox from "./HoverBoxes/WesternBox";
import Womenbox from "./HoverBoxes/Womenbox";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import ChildrenBox from "./HoverBoxes/ChildrenBox";

const CategoryBar = (props: {
  className: unknown;
  drop: boolean;
  Img: boolean;
}) => {
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
        Img={props.Img}
        label="Men"
        active={isActive("/men")}
        hover="hover:bg-[#00ffff] hover:border-[#00ffff] hover:border-b-2"
        activeStyle="bg-[#00ffff] border-[#00ffff] border-b-2"
        dropdown={<Menbox />}
        drop={props.drop}
      />

      <NavItem
        href="/women"
        src="/Assets/Images/CateImg/womennew.png"
        Img={props.Img}
        label="Women"
        active={isActive("/women")}
        hover="hover:bg-[#f04aff] hover:border-[#f04aff] hover:border-b-2"
        activeStyle="bg-[#f04aff] border-[#f04aff] border-b-2"
        dropdown={<Womenbox />}
        drop={props.drop}
      />

      <NavItem
        href="/children"
        src={""} 
        Img={props.Img}  
        label="Children"
        active={isActive("/children")}
        hover="hover:bg-[#ffff00] hover:border-[#ffff00] hover:border-b-2"
        activeStyle="bg-[#ffff00] border-[#ffff00] border-b-2"
        dropdown={<ChildrenBox />} // boys + girls inside
        drop={props.drop}
      />

      <NavItem
        href="/western"
        src="/Assets/Images/CateImg/western.png"
        Img={props.Img}
        label="Western"
        active={isActive("/western")}
        hover="hover:bg-[#a6ff00] hover:border-[#a6ff00] hover:border-b-2"
        activeStyle="bg-[#a6ff00] border-[#a6ff00] border-b-2"
        dropdown={<Westernbox />}
        drop={props.drop}
      />

      <NavItem
        href="/traditionals"
        src="/Assets/Images/CateImg/traditional.png"
        Img={props.Img}
        label="Traditional"
        active={isActive("/traditionals")}
        hover="hover:bg-[#c50052] hover:border-[#c50052] hover:border-b-2"
        activeStyle="bg-[#c50052] border-[#c50052] border-b-2"
        dropdown={<Traditionalbox />}
        drop={props.drop}
      />

      <NavItem
        href="/offers"
        Img={props.Img}
        src="/Assets/Images/CateImg/offer.png"
        label="Offer"
        active={isActive("/offers")}
        hover="hover:bg-[#ff6600] hover:border-[#ff6600] hover:border-b-2"
        activeStyle="bg-[#ff6600] border-[#ff6600] border-b-2"
      />
    </section>
  );
};

export default CategoryBar;
