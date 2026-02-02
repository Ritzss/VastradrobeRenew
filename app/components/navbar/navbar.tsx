/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaOpencart, FaRegHeart } from "react-icons/fa6";
import { IoCart, IoSearch } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { useAppContext } from "@/hooks/useAppContext";
import Link from "next/link";
import { Home, LogOut } from "lucide-react";
import { AiFillProduct } from "react-icons/ai";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const searchItems = [
    "Pants....",
    "Tops...",
    "Sandals.....",
    "Jackets...",
    "etc..",
  ];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const {
    user,
    authLoading,
    cartCount,
    searchQuery,
    handleLogout,
    setSearchQuery,
  } = useAppContext();
  const isLogged = !!user;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % searchItems.length);
    }, 3000);
    return () => clearInterval(id);
  });

  return (
    <nav id={"navcontainer"} className="bg-[#ffffff] rounded-xl">
      <section className="">
        <article className="flex justify-between items-center w-full px-10 bg-[#cd0000] text-white">
          <Link
            scroll={false}
            href={"/"}
            className="flex justify-center relative border-2 border-dashed rounded-2xl h-[10vh] w-[15vw]"
          >
            <Image
              src={"https://res.cloudinary.com/dwhn5ec09/image/upload/v1769775688/VaStraDrobe_vtulqu.png"}
              fill
              loading="eager"
              sizes="images"
              alt={"Vastradrobe"}
            />
          </Link>
          <span className="flex items-center pt-[4%] h-[18vh] gap-2">
            {!authLoading && !isLogged && (
              <Link scroll={false} href="/account/login">
                <div className="flex text-lg gap-2 items-center">
                  <RiAccountBoxLine />
                  <span className="text-lg">Login/Register</span>
                </div>
              </Link>
            )}
            {isLogged && (
              <Link
                scroll={false}
                href="/profile"
                className=" flex gap-2 items-center text-lg hover:border-b"
              >
                <RiAccountBoxFill />
                <span className="text-lg"> {user?.username}</span>
              </Link>
            )}

            {isLogged && (
              <span
                className="text-lg hover:border-b cursor-pointer flex gap-2 items-center"
                onClick={handleLogout}
              >
                <LogOut />
                <span className="text-lg"> Logout</span>
              </span>
            )}
          </span>
        </article>
      </section>
      <section className="sticky top-0 z-50 border mt-1 rounded-xl bg-[#ffffff] text-[#cd0000] flex justify-center gap-2 p-[0.5%] h-[7vh]">
        <header
          id={"navcontentheader"}
          className="flex justify-center items-center gap-3"
        >
          <Link href={"/"}>
            <div className="flex text-lg hover:border-b gap-2 items-center">
              <Home />
              Home
            </div>
          </Link>
          <Link href={"/product"}>
            <div className="flex text-lg hover:border-b gap-2 items-center">
              <AiFillProduct />
              All Products
            </div>
          </Link>
        </header>
        <main id={"navcontentmain"} className="w-[35%] text-black">
          <span className="border flex bg-white justify-between rounded-xl w-full">
            
            <span className="flex items-center px-2 gap-1 h-[4.5vh] w-full">
              <input
              className="w-full outline-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/search?q=${encodeURIComponent(searchQuery)}`,
                    );
                  }
                }}
                placeholder={`Search ${searchItems[index]}?`}
              />
              {suggestions.length > 0 && (
                <div className="absolute bg-white border w-full mt-1 rounded-lg shadow-lg z-50">
                  {suggestions.map((item) => (
                    <div
                      key={item.productId}
                      onClick={() => {
                        router.push(`/product/${item.productId}`);
                        setSuggestions([]);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
              <label htmlFor="search" className="font-bold p-1">
                <IoSearch />
              </label>
            </span>
          </span>
        </main>
        <footer className="flex items-center overflow-hidden">
          {/* Inline expanding menu */}
          <div
            id="navcontentfooter"
            className={`flex items-center transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-w-178 opacity-100" : "max-w-0 opacity-0"}`}
          >
            <aside className="px-3 flex items-center gap-5 bg-white rounded-md whitespace-nowrap">
              <Link
                scroll={false}
                href="/favorites"
                className="flex gap-2 justify-center items-center text-lg hover:border-b"
              >
                <FaRegHeart />
                <span className="text-lg">Favorites</span>
              </Link>
              <Link
                scroll={false}
                href="/orders"
                className="flex gap-2 justify-center items-center text-lg hover:border-b"
              >
                <IoCart />
                <span className="text-lg">Orders</span>
              </Link>

              <div className="flex text-lg hover:border-b gap-2 items-center">
                <MdSupportAgent />
                <span className="text-lg">ContactUs</span>
              </div>

              <Link href="/cart" scroll={false}>
                <div className="relative flex hover:border-b text-lg gap-3 items-center">
                  <FaOpencart />
                  <span className="text-lg">Cart</span>
                  <div className="absolute w-[25%] h-[55%] text-sm flex items-center justify-center rounded-full -right-4 top-0 text-[#cd0000]">
                    {cartCount}
                  </div>
                </div>
              </Link>
            </aside>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="menu-btn ml-3 shrink-0"
            aria-label="Menu"
          >
            <span className={`line line1 ${open ? "open" : ""}`} />
            <span className={`line line2 ${open ? "open" : ""}`} />
          </button>
        </footer>
      </section>
    </nav>
  );
};

export default Navbar;
