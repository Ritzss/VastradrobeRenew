/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { IoSearch, IoCart } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { Dock, Home, LogOut, ShoppingBag } from "lucide-react";

import { useAppContext } from "@/hooks/useAppContext";
import { FaRegListAlt } from "react-icons/fa";
import TypingEffect from "../UI/TypingEffect";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const searchItems = [
    "Pants......",
    "Tops.......",
    "Sandals....",
    "Jackets...",
    "Pants......",
    "Tops.......",
    "Sandals....",
    "Jackets...",
  ];
  const [index, setIndex] = useState(0);

  const {
    user,
    authLoading,
    cartCount,
    searchQuery,
    setSearchQuery,
    handleLogout,
  } = useAppContext();

  const isLogged = !!user;

  useEffect(() => {
    if (pathname !== "/") {
      setShowCategoryDropdown(true);
      return;
    }

    const handleScroll = () => {
      const section = document.getElementById("category-section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      setShowCategoryDropdown(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  /* rotating placeholder */
  useEffect(() => {
    const id = setInterval(
      () => setIndex((p) => (p + 1) % searchItems.length),
      2000,
    );
    return () => clearInterval(id);
  }, [searchItems.length]);

  const [value, setValue] = useState(searchQuery);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const handleChange = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  /* 🔍 FETCH SEARCH SUGGESTIONS (DEBOUNCED) */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSelectSuggestion = (id: string) => {
    setSuggestions([]);
    setSearchQuery("");
    router.push(`/product/${id}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto h-16 lg:px-4 flex justify-center items-center gap-6">
        {/* LOGO */}
        <Link
          href="/"
          className="relative h-21 w-25 mr-[30%] md:mr-0 lg:mr-0 rounded-xl shrink-0"
        >
          <Image
            src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1771306086/Logo_ac9n0g.png"
            fill
            sizes="photo"
            alt="Vastradrobe"
            className="object-contain"
            priority
          />
        </Link>

        {/* NAV */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className="hover:text-[#6a0f1f] hover-underline-center"
          >
            Home
          </Link>
          <div className="relative group">
            <Link
              href="/product"
              className="hover:text-[#6a0f1f] flex items-center hover-underline-center"
            >
              Our Collection{" "}
              <IoIosArrowDown
                size={16}
                className={`${showCategoryDropdown ? "opacity-100 inline-block" : "opacity-0 hidden"} duration-700 transition-all`}
              />
            </Link>

            {showCategoryDropdown && (
              <div className="absolute left-0 w-40 bg-white border overflow-hidden rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none group-hover:pointer-events-auto">
                <Link
                  href="/women"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#6a0f1f] hover-underline-center"
                >
                  Women
                </Link>
                <Link
                  href="/men"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#6a0f1f] hover-underline-center"
                >
                  Men
                </Link>
                <Link
                  href="/kids"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#6a0f1f] hover-underline-center"
                >
                  Kids
                </Link>
                <Link
                  href="/ethnic"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#6a0f1f] hover-underline-center"
                >
                  Ethnic
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/blog"
            className="hover:text-[#6a0f1f] hover-underline-center"
          >
            Blog
          </Link>
        </div>

        {/* SEARCH on Desktop*/}
        <div className="flex-1 max-w-md lg:block hidden relative">
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
            <IoSearch className="text-gray-400 text-sm" />
            <div className="relative  gap-1 ml-2 w-full">
              <input
                className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && value.trim()) {
                    setSuggestions([]);
                    router.push(`/search?q=${encodeURIComponent(value)}`);
                  }
                }}
              />

              {!value && (
                <div className="absolute flex gap-1 left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                  <span>Search </span>
                  <TypingEffect text={`${searchItems[index]}`} />
                </div>
              )}
            </div>
          </div>

          {/* SUGGESTIONS */}
          {searchQuery && (
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-sm z-50 max-h-72 overflow-auto">
              {loadingSuggestions && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  Searching…
                </div>
              )}

              {!loadingSuggestions && suggestions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No results found
                </div>
              )}

              {suggestions.map((item) => (
                <div
                  key={item.productId}
                  onClick={() => handleSelectSuggestion(item.productId)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CART */}
        <Link
          href="/cart"
          className="relative text-gray-700 hover:text-[#6a0f1f] hover-underline-center"
        >
          <IoCart size={21} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 text-xs bg-[#6a0f1f] text-white rounded-full px-1.5">
              {cartCount}
            </span>
          )}
        </Link>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-4 text-gray-700">
          {!authLoading && !isLogged && (
            <Link
              href="/account/login"
              className="text-sm hover:text-[#6a0f1f] hover-underline-center transition "
            >
              Login
            </Link>
          )}

          {isLogged && (
            <>
              <Link
                href="/favorites"
                className="hover:text-[#6a0f1f] hover-underline-center transition"
                title="Favorites"
              >
                <FaRegHeart size={21} />
              </Link>

              {/* Support */}
              <Link
                href="/support"
                className="relative text-gray-700 hover:text-[#6a0f1f] hover-underline-center"
              >
                <MdSupportAgent size={21} />
              </Link>

              <Link
                href="/orders"
                className="hover:text-[#6a0f1f] hover-underline-center transition"
                title="Orders"
              >
                <FaRegListAlt size={21} />
              </Link>

              <Link
                href="/profile"
                className="hover:text-[#6a0f1f] flex hover-underline-center transition text-sm  gap-2"
              >
                <RiAccountBoxLine size={21} />
                {user?.username}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover-underline-center"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* HAMBURGER */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1"
            aria-label="Menu"
          >
            <span className="w-5 h-0.5 bg-gray-700" />
            <span className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-15 left-0 z-10 right-0 border bg-white px-4 py-4 space-y-4 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SEARCH on Mobile*/}
            <div className="flex-1 max-w-md relative">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300">
                <IoSearch className="text-gray-400 text-sm" />
                <input
                  className="ml-2 w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setSuggestions([]);
                      router.push(
                        `/search?q=${encodeURIComponent(searchQuery)}`,
                      );
                    }
                  }}
                  placeholder={`Search ${searchItems[index]}`}
                />
              </div>

              {/* SUGGESTIONS */}
              {searchQuery && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-sm z-50 max-h-72 overflow-auto">
                  {loadingSuggestions && (
                    <div className="px-4 py-2 text-sm text-gray-400 ">
                      Searching…
                    </div>
                  )}

                  {!loadingSuggestions && suggestions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No results found
                    </div>
                  )}

                  {suggestions.map((item) => (
                    <div
                      key={item.productId}
                      onClick={() => handleSelectSuggestion(item.productId)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!authLoading && !isLogged && (
              <Link
                href="/account/login"
                className="flex gap-2 hover-underline-center"
              >
                <RiAccountBoxLine /> Login / Register
              </Link>
            )}
            <Link href="/" className="flex gap-2 hover-underline-center">
              <Home size={16} /> Home
            </Link>
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                Collection
              </button>

              {open && (
                <div className="mt-2 w-100 bg-white shadow-md rounded-md">
                  <Link
                    href="/women"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Women
                  </Link>

                  <Link
                    href="/men"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Men
                  </Link>

                  <Link
                    href="/kids"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Kids
                  </Link>

                  <Link
                    href="/ethnic"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Ethnic
                  </Link>
                </div>
              )}
            </div>

            <Link href="/blog" className="flex gap-2 hover-underline-center">
              <Dock size={16} /> Blog
            </Link>

            <Link href="/support" className="flex gap-2 hover-underline-center">
              <MdSupportAgent /> Contact Support
            </Link>
            {isLogged && (
              <>
                <Link
                  href="/profile"
                  className="flex gap-2 hover-underline-center"
                >
                  <RiAccountBoxFill size={16} /> {user?.username}
                </Link>

                <Link
                  href="/favorites"
                  className="flex gap-2 hover-underline-center"
                >
                  <FaRegHeart size={16} /> Favorites
                </Link>

                <Link
                  href="/orders"
                  className="flex gap-2 hover-underline-center"
                >
                  <FaRegListAlt size={16} /> Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex gap-2 text-[#6a0f1f] hover-underline-center"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
