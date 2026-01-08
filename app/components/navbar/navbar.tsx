"use client";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { FaOpencart, FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menbox from "./HoverBoxes/Menbox";
import Womenbox from "./HoverBoxes/Womenbox";
import Boysbox from "./HoverBoxes/Boysbox";
import GirlsBox from "./HoverBoxes/GirlsBox";
import Traditionalbox from "./HoverBoxes/Traditionalbox";
import Westernbox from "./HoverBoxes/WesternBox";

const Navbar = () => {
  const searchItems = [
    "Pants....",
    "Tops...",
    "Sandals.....",
    "Jackets...",
    "etc..",
  ];
  const [index, setIndex] = useState(0);
  const { islogged } = useAppContext();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % searchItems.length);
    }, 3000);

    return () => clearInterval(id);
  });

  return (
    <nav
      id={"navcontainer"}
      className="bg-[#dadada] transition-all ease-in-out duration-500 rounded-xl"
    >
      <section className=" flex gap-3 border rounded-t-xl p-[1%]">
        <header id={"navcontentheader"}>
          <Link href={"/"}>
            <Image
              src={"/Assets/Images/vastradrobe.png"}
              width={120}
              height={1}
              alt={"Vastradrobe"}
            />
          </Link>
        </header>
        <main id={"navcontentmain"} className="w-[65%]">
          <span className="border flex bg-white justify-between rounded-xl w-[85%]">
            <span className=" w-[20%]">
              <select
                className="w-full border-r-2  outline-0 p-2"
                name="gender"
                id="gender"
              >
                <option value="Male">Man</option>
                <option value="Women">Women</option>
                <option value="Boys">Boys</option>
                <option value="Boys">Girl</option>
              </select>
            </span>
            <span className="flex items-center px-1 gap-1 w-full">
              <input
                type="text"
                id="search"
                name="search"
                className="outline-0 text-lg w-full"
                placeholder={`Search ${searchItems[index]}?`}
              />
              <label htmlFor="search" className="font-bold p-1">
                <IoSearch />
              </label>
            </span>
          </span>
        </main>
        <footer id={"navcontentfooter"}>
          <aside className="p-1 flex gap-5">
            {!islogged && (
              <Link href={"/account/login"}>
                <div className="flex text-2xl gap-2 items-center">
                  <RiAccountBoxLine /> <span className="text-lg">Login</span>
                </div>
              </Link>
            )}
            <div className="flex text-2xl gap-2 items-center">
              <MdSupportAgent /> <span className="text-lg">ContactUs</span>
            </div>
            {islogged && (
              <div className="flex text-2xl gap-2 items-center">
                <RiAccountBoxFill /> <span className="text-lg">Account</span>
              </div>
            )}
            <div className="flex text-xl items-center">
              <FaRegHeart />
            </div>
            <div className="flex text-2xl gap-2 items-center">
              <FaOpencart /> <span className="text-lg">Cart</span>
            </div>
          </aside>
        </footer>
      </section>
      <section className="flex justify-evenly border text-xl rounded-b-xl w-full">
        <NavItem
          href="/men"
          label="Men"
          active={isActive("/men")}
          hover="hover:bg-[#00ffff] hover:shadow-[inset_0_0_10px_0_#00ffff]"
          activeStyle="bg-[#00ffff] shadow-[inset_0_0_10px_0_#00ffff]"
          rounded="rounded-bl-xl"
          dropdown={<Menbox />}
        />

        <NavItem
          href="/women"
          label="Women"
          active={isActive("/women")}
          hover="hover:bg-[#f04aff] hover:shadow-[inset_0_0_10px_0_#f04aff]"
          activeStyle="bg-[#f04aff] shadow-[inset_0_0_10px_0_#f04aff]"
          dropdown={<Womenbox />}
        />

        <NavItem
          href="/boys"
          label="Boys"
          active={isActive("/boys")}
          hover="hover:bg-[#ffff00] hover:shadow-[inset_0_0_10px_0_#ffff00]"
          activeStyle="bg-[#ffff00] shadow-[inset_0_0_10px_0_#ffff00]"
          dropdown={<Boysbox />}
        />

        <NavItem
          href="/girls"
          label="Girls"
          active={isActive("/girls")}
          hover="hover:bg-[#ff00d4] hover:shadow-[inset_0_0_10px_0_#ff00d4]"
          activeStyle="bg-[#ff00d4] shadow-[inset_0_0_10px_0_#ff00d4]"
          dropdown={<GirlsBox />}
        />

        <NavItem
          href="/western"
          label="Western"
          active={isActive("/western")}
          hover="hover:bg-[#a6ff00] hover:shadow-[inset_0_0_10px_0_#a6ff00]"
          activeStyle="bg-[#a6ff00] shadow-[inset_0_0_10px_0_#a6ff00]"
          dropdown={<Westernbox />}
        />

        <NavItem
          href="/traditionals"
          label="Traditional"
          active={isActive("/traditionals")}
          hover="hover:bg-[#c50052] hover:shadow-[inset_0_0_10px_0_#c50052]"
          activeStyle="bg-[#c50052] shadow-[inset_0_0_10px_0_#c50052]"
          dropdown={<Traditionalbox />}
        />

        <NavItem
          href="/offers"
          label="Offer"
          active={isActive("/offers")}
          hover="hover:bg-[#ff6600] hover:shadow-[inset_0_0_10px_0_#ff6600]"
          activeStyle="bg-[#ff6600] shadow-[inset_0_0_10px_0_#ff6600]"
          rounded="rounded-br-xl"
        />
      </section>
    </nav>
  );
};

export default Navbar;

const NavItem = ({
  href,
  label,
  active,
  hover,
  activeStyle,
  rounded = "",
  dropdown,
}: {
  href: string;
  label: string;
  active: boolean;
  hover: string;
  activeStyle: string;
  rounded?: string;
  dropdown?: ReactNode;
}) => {
  return (
    <div
      className="group w-full"
      onMouseEnter={() => document.body.classList.add("scroll-lock")}
      onMouseLeave={() => document.body.classList.remove("scroll-lock")}
    >
      <div
        className={`p-3 font-bold text-center transition-all duration-500 text-black bg-clip-text hover:text-transparent
      ${rounded}
      ${hover}
      ${active ? `${activeStyle} text-transparent` : ""}`}
      >
        <Link href={href}>{label} </Link>
      </div>

      {dropdown && (
        <div className="absolute left-0 z-50 py-5 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          {dropdown}
        </div>
      )}
    </div>
  );
};
