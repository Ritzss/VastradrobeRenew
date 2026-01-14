"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaOpencart, FaRegHeart } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";

const Navbar = () => {
  const searchItems = [
    "Pants....",
    "Tops...",
    "Sandals.....",
    "Jackets...",
    "etc..",
  ];
  const [index, setIndex] = useState(0);
  const {
    user,
    authLoading,
    cartCount,
    searchQuery,
    handleLogout,
    setSearchQuery,
    selectGender,
    setSelectGender,
  } = useAppContext();
  const isLogged = !!user;
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
      <section className=" bg-[#cd0000] text-white flex gap-3 p-[0.5%]">
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
        <main id={"navcontentmain"} className="w-[65%] text-black">
          <span className="border flex bg-white justify-between rounded-xl w-[85%]">
            <span className=" w-[20%]">
              <select
                className="w-full border-r-2  outline-0 p-2"
                name="gender"
                value={selectGender}
                onChange={(e) => setSelectGender(e.target.value)}
                id="gender"
              >
                <option value="">All</option>
                <option value="Male">Men</option>
                <option value="Women">Women</option>
                <option value="Boys">Boys</option>
                <option value="Boys">Girl</option>
              </select>
            </span>
            <span className="flex items-center px-1 gap-1 w-full">
              <input
                type="text"
                id="search"
                value={searchQuery}
                name="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-0 text-lg w-full"
                placeholder={`Search ${searchItems[index]}?`}
              />
              <label htmlFor="search" className="font-bold p-1">
                <IoSearch />
              </label>
            </span>
          </span>
        </main>
        <footer id={"navcontentfooter"} className="self-end">
          <aside className="px-3 p-2 flex items-center justify-center gap-5">
            {!authLoading && !isLogged && (
              <Link href="/account/login">
                <div className="flex text-2xl gap-2 items-center">
                  <RiAccountBoxLine />
                  <span className="text-lg">Login</span>
                </div>
              </Link>
            )}
            <div className="flex text-2xl gap-2 items-center">
              <MdSupportAgent /> <span className="text-lg">ContactUs</span>
            </div>

            {!authLoading && isLogged && (
              <div className="flex text-2xl gap-4 items-center">
                <RiAccountBoxFill />
                <span className="text-lg"><Link href={"/profile"}>{user.username}</Link></span>
                <span className="text-lg cursor-pointer" onClick={handleLogout}>
                  Logout
                </span>
              </div>
            )}

            <Link href={"/favroites"}>
              <div className="flex text-xl items-center">
                <FaRegHeart />
              </div>
            </Link>
            <Link href={"/cart"}>
              <div className="relative flex text-2xl gap-3 items-center">
                <FaOpencart />
                <span className="text-lg">Cart </span>
                <div className="absolute w-[25%] h-[55%] text-sm justify-center items-center flex rounded-full -right-3 -top-2 bg-[#ff6600] text-white">
                  {cartCount}
                </div>
              </div>
            </Link>
          </aside>
        </footer>
      </section>
    </nav>
  );
};

export default Navbar;
