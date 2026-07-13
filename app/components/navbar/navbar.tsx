/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
import { IoSearch, IoCart } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { Dock, Home, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import img from "../../../public/Assets/Images/logoV4.png";
import { useAppContext } from "@/hooks/useAppContext";
import { FaRegListAlt } from "react-icons/fa";
// import TypingEffect from "../UI/TypingEffect";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import RotatingText from "../UI/RotatingText";
import { ShoppingBagIcon, ShoppingBagOpenIcon } from "@phosphor-icons/react";

/**
 * Fixes applied:
 * - consistent pill corners using rounded-full
 * - reliable dropdown open state (mouse + focus) so it doesn't close while interacting
 * - input + rotating placeholder vertically aligned
 *
 * UI-only tweaks — core logic (fetch, router, handlers) preserved.
 */

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  // const [showCategoryDropdown, setShowCategoryDropdown] = useState(true);
  const [open, setOpen] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false); // <-- small UI state to keep dropdown open while interacting
  const menuRef = useRef<HTMLDivElement>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const searchItems = [
    "Pants",
    "Tops",
    "Sandals",
    "Jackets",
    "Pants",
    "Tops",
    "Sandals",
    "Jackets",
  ];

  const {
    products,
    user,
    authLoading,
    cartCount,
    searchQuery,
    setSearchQuery,
    handleLogout,
  } = useAppContext();

  const isLogged = !!user;

  const [value, setValue] = useState(searchQuery);
  const [profileOpen, setProfileOpen] = useState(false);
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
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setLoadingSuggestions(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?search=${encodeURIComponent(
            searchQuery,
          )}`,
        );

        const data = await res.json();

        setSuggestions(data.products?.slice(0, 8) || []);
      } catch (error) {
        console.error("Suggestion Error:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);

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
    router.push(`/collection`);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) return;

    setSuggestions([]);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products
      .filter((product: any) =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5);

    setSuggestions(filtered);
  }, [searchQuery, products]);

  // const router = useRouter();

  // const [searchQuery, setSearchQuery] = useState("");
  // const [suggestions, setSuggestions] = useState<any[]>([]);
  return (
    // Make NAV pill slightly elevated and pill-shaped
    <nav aria-label="Main navigation">
      <div className="">
        <div
          className="w-full p-2 flex items-center gap-6 shadow-[0_10px_25px_rgba(149,127,106,0.08)] dark:bg-black/85 bg-[#fffdfd]"
          style={{
            // background: "#fffdfd",
            border: "1px solid rgba(0,0,0,0.04)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="relative nav-logo mx-4 shrink-0"
            style={{ perspective: "1000px" }}
          >
            <div className="relative w-14 h-14">
              {/* Front */}
              <div className="absolute inset-0 flex items-center w-20 h-20 -top-2.5 justify-center">
                <Image
                  src={img}
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-contain drop-shadow-xl"
                />
              </div>

              {/* Back
              <div
                className="absolute inset-0 rounded-full bg-[#cd0000] w-20 h-20 -top-3.5 -left-5 flex items-center justify-center shadow-xl"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <span className="text-3xl border-2 p-3 border-dashed rounded-full border-white aspect-square flex justify-center items-center inter font-bold text-white tracking-wider">
                  VD
                </span>
              </div> */}
            </div>
          </Link>

          {/* NAV LINKS (desktop) */}
          <div className="items-center gap-4 hidden md:flex flex-1 text-sm font-medium text-[#957f6a]">
            <Link href="/" className="hover:text-[#6a0f1f]">
              Home
            </Link>

            <div className="flex items-center">
              <Link href="/collection" className="hover:text-[#6a0f1f]">
                Our Collection
              </Link>

              <button
                onClick={() => setCollectionOpen(!collectionOpen)}
                className="ml-1 p-1 rounded-full hover:bg-[#f4f2dd] transition"
              >
                <IoIosArrowForward
                  size={14}
                  className={`transition-transform duration-300 ${
                    collectionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${collectionOpen ? "max-w-100 opacity-100 ml-2" : "max-w-0 opacity-0"}`}>
              <Link
                href="/women#categoryPage"
                className="whitespace-nowrap hover:text-[#6a0f1f]"
              >
                Women
              </Link>

              <Link
                href="/men"
                className="whitespace-nowrap hover:text-[#6a0f1f]"
              >
                Men
              </Link>

              <Link
                href="/kids"
                className="whitespace-nowrap hover:text-[#6a0f1f]"
              >
                Kids
              </Link>
            </div>

            <Link href="/blog" className="hover:text-[#6a0f1f]">
              Blogs
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* SEARCH on Desktop */}
            <div
              className="hidden lg:block relative rounded-full overflow-visible"
              style={{ width: "360px" }}
            >
              <div
                className="flex items-center rounded-full px-3 py-2"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "inset 0 2px 6px rgba(0,0,0,0.04), 0 6px 18px rgba(149,127,106,0.06)",
                }}
              >
                <IoSearch className="text-[#957f6a]" />
                {/* wrapper is flex so icon + input + rotating text align vertically */}
                <div className="relative flex-1 ml-3 flex items-center">
                  <input
                    className="w-full bg-transparent outline-none text-sm placeholder:text-[#b99f84] leading-5"
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
                    aria-label="Search products"
                    style={{ paddingTop: 2, paddingBottom: 2 }}
                  />

                  {/* rotating placeholder aligned vertically with input */}
                  {!value && (
                    <div
                      className="pointer-events-none absolute left-0 ml-0 flex items-center gap-1 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "#b99f84" }}
                    >
                      <span className="text-[#b99f84]">Search</span>
                      <RotatingText
                        texts={searchItems}
                        mainClassName="inline-block text-sm text-[#c0a38a] overflow-hidden leading-5"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden"
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 400,
                        }}
                        rotationInterval={2400}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SUGGESTIONS */}
              {searchQuery && (
                <div className="absolute left-0 right-0 mt-3 bg-white border rounded-xl shadow-sm z-50 max-h-72 overflow-auto">
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
              className="group relative text-[#957f6a] hover:text-[#6a0f1f]"
            >
              <div className="relative h-10 w-10">
                <ShoppingBagIcon
                  size={42}
                  color="#ff0000"
                  weight="duotone"
                  className="absolute inset-0 transition-all duration-300 group-hover:scale-75 group-hover:opacity-0"
                />

                <ShoppingBagOpenIcon
                  size={42}
                  color="#ff0000"
                  weight="duotone"
                  className="absolute inset-0 scale-125 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                />
              </div>

              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 rounded-full px-1.5 text-xs text-white"
                  style={{ background: "#957f6a" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center relative">
              {!authLoading && !isLogged && (
                <Link
                  href="/account/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#5f5143] bg-white hover:bg-[#e9e1d4] transition"
                >
                  <RiAccountBoxLine size={18} />
                  Login
                </Link>
              )}

              {isLogged && (
                <div
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#5f5143] text-sm font-medium shadow-sm hover:bg-[#e9e1d4] transition">
                    <RiAccountBoxLine size={18} />
                    <span className="max-w-27.5 truncate">
                      {user?.username}
                    </span>
                    <IoIosArrowDown size={14} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full pt-3 z-50">
                      {/* Arrow */}
                      <div className="absolute right-6 top-2 w-4 h-4 bg-white rotate-45 border-black/5"></div>

                      <div className="relative w-44 rounded-2xl overflow-hidden bg-white">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-5 text-sm text-[#5f5143] hover:bg-[#e9e1d4] transition"
                        >
                          <RiAccountBoxLine size={16} />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-5 cursor-pointer text-sm text-[#9a4b4b] hover:bg-[#e9e1d4] transition"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------Mobile Hamburger------------------------------------------------ */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e9e1d4] transition"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={22} strokeWidth={2} className="text-[#957f6a]" />
              ) : (
                <Menu size={22} strokeWidth={2} className="text-[#957f6a]" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU (rounded elevated panel) */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="fixed inset-x-4 top-24 z-50 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-[28px] p-5 space-y-6 dark:bg-[#1a1a1a] bg-[#fffdfd] shadow-[0_8px_30px_rgba(122,16,32,0.08)]">
              {/* SEARCH */}
              <div className="relative">
                <div
                  className="flex items-center gap-3 dark:bg-black bg-white rounded-full px-4 py-3"
                  style={{
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <IoSearch
                    className="text-[#957f6a] cursor-pointer"
                    size={18}
                    onClick={handleSearch}
                  />

                  <input
                    className="flex-1 bg-transparent outline-none dark:text-[#b99f84] text-sm placeholder:text-[#b99f84]"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border shadow-lg z-50 overflow-hidden">
                    {suggestions.map((item: any) => (
                      <button
                        key={item._id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                        onClick={() => {
                          setSearchQuery(item.productName);
                          setSuggestions([]);
                          router.push(
                            `/search?q=${encodeURIComponent(item.productName)}`,
                          );
                        }}
                      >
                        <div className="font-medium text-sm">
                          {item.productName}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRIMARY LINKS */}
              <div className="rounded-2xl overflow-hidden dark:bg-black bg-white divide-y divide-black/5">
                <Link
                  href="/"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <Home size={18} />
                  <span className="text-sm font-medium">Home</span>
                </Link>

                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <div className="flex items-center gap-4">
                    <ShoppingBag
                      size={16}
                      // color="#ff0000"
                      // weight="duotone"
                    />
                    <span className="text-sm font-medium">Collection</span>
                  </div>
                  <IoIosArrowDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="dark:bg-black bg-[#faf7f2]">
                    <Link
                      href="/women#categoryPage"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Women
                    </Link>
                    <Link
                      href="/men#categoryPage"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Men
                    </Link>
                    <Link
                      href="/kids#categoryPage"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Kids
                    </Link>
                  </div>
                )}

                <Link
                  href="/blog"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <Dock size={18} />
                  <span className="text-sm font-medium">Blog</span>
                </Link>

                <Link
                  href="/support"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <MdSupportAgent size={18} />
                  <span className="text-sm font-medium">Contact Support</span>
                </Link>
              </div>

              {/* ACCOUNT SECTION */}
              <div className="rounded-2xl overflow-hidden dark:bg-black bg-white divide-y divide-black/5">
                {!authLoading && !isLogged && (
                  <Link
                    href="/account/login"
                    className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                  >
                    <RiAccountBoxLine size={18} />
                    <span className="text-sm font-medium">
                      Login / Register
                    </span>
                  </Link>
                )}

                {isLogged && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <RiAccountBoxFill size={18} />
                      <span className="text-sm font-medium">
                        {user?.username}
                      </span>
                    </Link>

                    <Link
                      href="/favorites"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <FaRegHeart size={18} />
                      <span className="text-sm font-medium">Favorites</span>
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <FaRegListAlt size={18} />
                      <span className="text-sm font-medium">Orders</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-5 py-4 text-[#9a4b4b] hover:bg-[#e9e1d4] transition"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
